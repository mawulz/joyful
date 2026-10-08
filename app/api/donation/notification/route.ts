import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Donation from "@/lib/models/donation"
import { snap } from "@/lib/midtrans"

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const notificationJson = await request.json()

        const statusResponse = await snap.transaction.notification(notificationJson)

        const orderId = statusResponse.order_id
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status
        const paymentType = statusResponse.payment_type

        console.log(
            `Notification for ${orderId}: status=${transactionStatus} fraud=${fraudStatus}`
        )

        let newStatus: "PENDING" | "SETTLEMENT" | "EXPIRED" | "FAILED" | null = null

        if (transactionStatus === "capture") {
            if (fraudStatus === "challenge") {
                newStatus = "PENDING"
            } else if (fraudStatus === "accept") {
                newStatus = "SETTLEMENT"
            }
        } else if (transactionStatus === "settlement") {
            newStatus = "SETTLEMENT"
        } else if (transactionStatus === "deny") {
            newStatus = null
        } else if (transactionStatus === "cancel") {
            newStatus = "FAILED"
        } else if (transactionStatus === "expire") {
            newStatus = "EXPIRED"
        } else if (transactionStatus === "pending") {
            newStatus = "PENDING"
        }

        if (newStatus) {
            await Donation.findOneAndUpdate(
                { orderId },
                { status: newStatus, paymentType }
            )
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error) {
        console.error("Failed to process Midtrans notification:", error)
        return NextResponse.json(
            { error: "Failed to process notification" },
            { status: 500 }
        )
    }
}