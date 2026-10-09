import { auth, getSession } from "@/lib/auth/auth";
import cloudinary from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const MAX_IMAGE_LENGTH = 2_000_000

const avatarSchema = z.object({
    image: z.string().startsWith("data:image/", "Must be an image data URI").max(MAX_IMAGE_LENGTH, "Image is too large")
})

export async function PUT(req: NextRequest){
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

        const body = await req.json()
        const parsed = avatarSchema.safeParse(body)

        if (!parsed.success){
            return NextResponse.json(
                { error: "Invalid image", details: z.flattenError(parsed.error) },
                { status: 400 }
            )
        }

        const upload = await cloudinary.uploader.upload(parsed.data.image, {
            folder: "avatars",
            public_id: session.user.id,
            overwrite: true,
            resource_type: "image",
        })

        const result = await auth.api.updateUser({
            body: { image: upload.secure_url },
            headers: await headers()
        })

        return NextResponse.json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error("Avatar upload error:", error)
        return NextResponse.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        )
    }
}