import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    buyerId: mongoose.Types.ObjectId; // ref: User
    assetId: mongoose.Types.ObjectId; // ref: Asset
    amount: number;
    status: "pending" | "completed" | "failed" | "refunded";
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
        amount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
