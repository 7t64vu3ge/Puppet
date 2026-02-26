import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    reviewerId: mongoose.Types.ObjectId; // ref: User
    assetId: mongoose.Types.ObjectId;    // ref: Asset
    rating: number;                      // 1 to 5
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

// Ensure one review per user per asset
ReviewSchema.index({ reviewerId: 1, assetId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
