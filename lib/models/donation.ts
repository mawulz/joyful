import mongoose, { Schema, models, Model } from "mongoose";

export type DonationStatus = "PENDING" | "SETTLEMENT" | "EXPIRED" | "FAILED"

export interface IDonation {
    orderId: string
    donorName: string
    donorEmail: string
    amount: number
    status: DonationStatus
    paymentType?: string
    snapToken?: string
    createdAt: Date 
}

const DonationSchema = new Schema<IDonation>({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "SETTLEMENT", "EXPIRED", "FAILED"],
        default: "PENDING",
    },
    paymentType: {
        type: String,
    },
    snapToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Donation: Model<IDonation> = mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema)

export default Donation