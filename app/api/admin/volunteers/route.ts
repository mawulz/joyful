import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { Volunteer } from "@/lib/models/volunteer";
import { requireAdmin } from "@/lib/auth/require-admin";

const decisionSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("response" in authResult) return authResult.response;

  try {
    const body = await request.json();
    const parsed = decisionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    if (!mongoose.isValidObjectId(parsed.data.id)) {
      return NextResponse.json(
        { error: "Invalid volunteer application ID." },
        { status: 400 },
      );
    }

    await connectDB();

    let updated: { _id: mongoose.Types.ObjectId; status: "APPROVED" | "REJECTED" | "PENDING" } | null = null;
    let userRecordMissing = false;

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const application = await Volunteer.findOneAndUpdate(
          { _id: parsed.data.id, status: "PENDING" },
          { $set: { status: parsed.data.status } },
          { new: true, runValidators: true, session },
        ).lean<{
          _id: mongoose.Types.ObjectId;
          userId: mongoose.Types.ObjectId;
          status: "PENDING" | "APPROVED" | "REJECTED";
        }>();

        if (!application) return;

        const db = mongoose.connection.db;
        if (!db) throw new Error("MongoDB connection is not ready.");

        const userId = String(application.userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error("Invalid user ID.");
        }

        const userFilter = { _id: new mongoose.Types.ObjectId(userId), };
        const volunteerFlag = parsed.data.status === "APPROVED";
        const userUpdates = await Promise.all(
          ["users"].map((collectionName) =>
            db.collection(collectionName).updateOne(
              userFilter,
              { $set: { isVolunteer: volunteerFlag } },
              { session },
            ),
          ),
        );

        if (userUpdates.every((result) => result.matchedCount === 0)) {
          userRecordMissing = true;
          throw new Error("No user record matches this volunteer application.");
        }

        updated = { _id: application._id, status: application.status };
      });
    } catch (error) {
      if (userRecordMissing) {
        return NextResponse.json(
          { error: "Could not find the applicant's user record to update." },
          { status: 404 },
        );
      }
      throw error;
    } finally {
      await session.endSession();
    }

    const finalUpdated = updated as { _id: mongoose.Types.ObjectId; status: "APPROVED" | "REJECTED" | "PENDING" } | null;

    if (!finalUpdated) {
      const exists = await Volunteer.exists({ _id: parsed.data.id });
      return NextResponse.json(
        {
          error: exists
            ? "This application has already been reviewed. Refresh the dashboard."
            : "Volunteer application not found.",
        },
        { status: exists ? 409 : 404 },
      );
    }

    return NextResponse.json({
      application: {
        id: String(finalUpdated._id),
        status: finalUpdated.status,
      },
    });
  } catch (error) {
    console.error("Volunteer decision error:", error);
    return NextResponse.json(
      { error: "Could not update the volunteer application." },
      { status: 500 },
    );
  }
}
