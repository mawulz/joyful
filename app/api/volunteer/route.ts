import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Volunteer } from "@/lib/models/volunteer";
import { uploadPdfToCloudinary } from "@/lib/helpers/cloudinary-helper";
import { rateLimit } from "@/lib/rate-limit";

const volunteerSchema = z.object({
    skillArea: z.enum(["pengajar", "dokumentasi", "logistik-acara"]),
    reason: z.string().min(10, "Motivasi minimal 10 karakter")
})

export async function POST(req: NextRequest){
    try {
        const session = await getSession()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in first" },
                { status: 401 }
            )
        }

        const LIMIT = 10
        const WINDOW_MS = 60 * 60 * 1000

        const { success, resetTime } = rateLimit({
            key: `volunteer-application:${session.user.id}`,
            limit: LIMIT,
            windowMs: WINDOW_MS
        })

        if (!success) {
            const resetIn = Math.ceil((resetTime! - Date.now()) / 1000)
            return NextResponse.json(
                { error: `Too many reques, try again in ${resetIn}s` },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': String(LIMIT),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil(resetTime! / 1000))
                    }
                }
            )
        }

        const formData = await req.formData()
        const cvFile = formData.get("cv") as File | null

        const parsed = volunteerSchema.safeParse({
            skillArea: formData.get("field"),
            reason: formData.get("motivation")
        })

        if (!parsed.success){
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            )
        }

        if (!cvFile || cvFile.size === 0){
            return NextResponse.json(
                { error: "CV must be PDF file." },
                { status: 400 }
            )
        }

        if (cvFile?.type !== "application/pdf"){
            return NextResponse.json(
                { error: "CV must be PDF file." },
                { status: 400 }
            )
        }

        const MAX_SIZE = 5 * 1024 * 1024
        if (cvFile.size > MAX_SIZE){
            return NextResponse.json(
                { error: "CV file must be under 5MB." },
                { status: 400 }
            )
        }
        
        const bytes = await cvFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const upload = await uploadPdfToCloudinary(
            buffer,
            session.user.id
        )

        const portfolioUrl = upload.secure_url

        await connectDB()

        const application = await Volunteer.create({
            userId: session.user.id,
            skillArea: parsed.data.skillArea,
            reason: parsed.data.reason,
            portfolioUrl,
        })

        return NextResponse.json(
            { message: "Application submitted successfully.", application },
            { status: 201 }
        )
    } catch (error) {
        console.error("Volunteer application error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}