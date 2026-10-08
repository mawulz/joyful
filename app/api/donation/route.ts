import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Donation from "@/lib/models/donation"
import { snap } from "@/lib/midtrans"

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { donorName, donorEmail, amount } = body

        if (!donorName || !donorEmail || !amount) {
            return NextResponse.json(
                { error: "donorName, donorEmail, and amount are required" },
                { status: 400 }
            )
        }

        if (typeof amount !== "number" || amount < 20000) {
            return NextResponse.json(
                { error: "Minimal donasi Rp 20.000" },
                { status: 400 }
            )
        }

        const orderId = `DONATE-${Date.now()}`

        const donation = await Donation.create({
            orderId,
            donorName,
            donorEmail,
            amount,
            status: "PENDING",
        })

        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                first_name: donorName,
                email: donorEmail,
            },
        })

        donation.snapToken = transaction.token
        await donation.save()

        return NextResponse.json(
            {
                orderId: donation.orderId,
                snapToken: transaction.token,
                redirectUrl: transaction.redirect_url,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Failed to create donation:", error)
        return NextResponse.json(
            { error: "Failed to create donation" },
            { status: 500 }
        )
    }
}