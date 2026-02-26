import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
    title: string;
    description: string;
    price: number;
    previewModelId?: string; // Sketchfab UID (optional)
    thumbnailUrl?: string;   // (optional)
    ownerId: mongoose.Types.ObjectId; // ref: User
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        previewModelId: { type: String }, // optional Sketchfab model UID
        thumbnailUrl: { type: String },   // optional
        ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// Text index for title search
AssetSchema.index({ title: "text" });

export default mongoose.model<IAsset>("Asset", AssetSchema);

