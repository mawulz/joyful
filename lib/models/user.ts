import mongoose, { Schema, models, Model, model } from "mongoose";
import { boolean } from "zod";

export interface IUser {
    name: string
    email: string
    image: string
    phoneNumber: string
    dateOfBirth: Date
    isVolunteer: boolean
    createAt: Date
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    isVolunteer: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
    }
})

export const User = models.User || model<IUser>("User", UserSchema)