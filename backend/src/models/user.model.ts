import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
    role: "buyer" | "seller" | "admin";
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        googleId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>("User", UserSchema);
