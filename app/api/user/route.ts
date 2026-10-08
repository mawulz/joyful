import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import { auth, getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";
import { Volunteer } from "@/lib/models/volunteer";
import z from "zod";
import { headers } from "next/headers";

export async function GET(req: NextRequest){
    try {
        const session = await getSession()

        if (!session?.user){
            return NextResponse.json(
                { error: "Unauthorized. Please sign in first" },
                { status: 401 }
            )
        }

        await connectDB()
        const user = session.user as typeof session.user & {
            phoneNumber?: string
            dateOfBirth?: Date | string | null
            createdAt?: Date | string
        }
        
        if (!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const volunteerApp = await Volunteer.findOne({
            userId: new Types.ObjectId(session.user.id)
            // status: "APPROVE"
        }).lean()

        const userData = {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
            image: user.image || null,
            phoneNumber: user.phoneNumber ?? '',
            dateOfBirth: user.dateOfBirth ?? null,
            isVolunteer: Boolean(volunteerApp) || user.isVolunteer || false,
            createAt: user.createdAt ?? null
        }

        return NextResponse.json({
            success: true,
            data: userData
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

const updateProfileSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number")
        .or(z.literal(""))
        .optional(),
    dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
        .optional(),
})

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()

        if (!session?.user){
            return NextResponse.json(
                { error: "Unauthorized. Please sign in first" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const parsed = updateProfileSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { name, phoneNumber, dateOfBirth } = parsed.data

        const updatePayload: Record<string, unknown> = {}
        if (name !== undefined) updatePayload.name = name
        if (phoneNumber !== undefined) updatePayload.phoneNumber = phoneNumber
        if (dateOfBirth !== undefined) updatePayload.dateOfBirth = new Date(dateOfBirth)

        const result = await auth.api.updateUser({
            body: updatePayload,
            headers: await headers(),
        })

        return NextResponse.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error("Failed to update profile:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}