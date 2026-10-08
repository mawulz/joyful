import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Donation from "@/lib/models/donation";
import { Volunteer } from "@/lib/models/volunteer";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAdmin();
  if ("response" in authResult) return authResult.response;

  try {
    await connectDB();

    const [donationRecords, applications] = await Promise.all([
      Donation.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .select("orderId donorName donorEmail amount status paymentType createdAt")
        .lean(),
      Volunteer.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .select("userId skillArea reason portfolioUrl status createdAt")
        .lean(),
    ]);

    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection is not ready.");

    const userIds = [
      ...new Set(applications.map((application) => String(application.userId))),
    ];

    const userIdCandidates = userIds.flatMap((id) => {
      const candidates: Array<string | mongoose.Types.ObjectId> = [id];
      if (mongoose.Types.ObjectId.isValid(id)) {
        candidates.push(new mongoose.Types.ObjectId(id));
      }
      return candidates;
    });

    const userRecords = userIdCandidates.length
      ? (
          await Promise.all(
            ["user", "users"].map((collectionName) =>
              db
                .collection<{
                  _id: string | mongoose.Types.ObjectId;
                  id?: string;
                  name?: string;
                  email?: string;
                }>(collectionName)
                .find({ _id: { $in: userIdCandidates } })
                .project({ name: 1, email: 1, id: 1 })
                .toArray(),
            ),
          )
        ).flat()
      : [];

    const usersById = new Map<string, (typeof userRecords)[number]>();
    for (const user of userRecords) {
      usersById.set(String(user._id), user);
      if (user.id) usersById.set(user.id, user);
    }

    return NextResponse.json({
      donations: donationRecords.map((donation) => ({
        id: String(donation._id),
        orderId: donation.orderId,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount,
        status: donation.status,
        paymentType: donation.paymentType ?? null,
        createdAt: donation.createdAt?.toISOString() ?? null,
      })),
      applications: applications.map((application) => {
        const userId = String(application.userId);
        const user = usersById.get(userId);

        return {
          id: String(application._id),
          userId,
          userName: user?.name ?? "Unknown user",
          skillArea: application.skillArea,
          reason: application.reason,
          resumeUrl: application.portfolioUrl ?? null,
          status: application.status,
          createdAt: application.createdAt?.toISOString() ?? null,
        };
      }),
    });
  } catch (error) {
    console.error("Admin dashboard data error:", error);
    return NextResponse.json(
      { error: "Could not load dashboard data." },
      { status: 500 },
    );
  }
}
