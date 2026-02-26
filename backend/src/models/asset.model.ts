import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
    title: string;
    description: string;
    price: number;
    previewModelId: string; // Sketchfab UID
    thumbnailUrl: string;
    ownerId: mongoose.Types.ObjectId; // ref: User
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        previewModelId: { type: String, required: true }, // Sketchfab model UID
        thumbnailUrl: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

export default mongoose.model<IAsset>("Asset", AssetSchema);
