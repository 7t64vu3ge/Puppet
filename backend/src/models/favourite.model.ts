import mongoose, { Schema, Document } from "mongoose";

export interface IFavourite extends Document {
    userId: mongoose.Types.ObjectId;  // ref: User
    assetId: mongoose.Types.ObjectId; // ref: Asset
    createdAt: Date;
}

const FavouriteSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only favourite an asset once
FavouriteSchema.index({ userId: 1, assetId: 1 }, { unique: true });

export default mongoose.model<IFavourite>("Favourite", FavouriteSchema);
