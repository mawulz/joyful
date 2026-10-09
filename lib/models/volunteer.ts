import { Schema, models, model } from "mongoose";

export interface IVolunteer {
    userId: string
    skillArea: "pengajar" | "dokumentasi" | "logistik-acara"
    reason: string
    portfolioUrl?: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: Date
}

const VolunteerSchema = new Schema<IVolunteer>({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    skillArea: {
        type: String,
        required: true,
        enum: ["pengajar", "dokumentasi", "logistik-acara"]
    },
    reason: {
        type: String,
        required: true
    },
    portfolioUrl: {
        type: String
    },
    status: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "APPROVED", "REJECTED"]
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    }
})

export const Volunteer = models.Volunteer || model<IVolunteer>("Volunteer", VolunteerSchema)