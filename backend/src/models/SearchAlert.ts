import mongoose, { Schema, Document } from "mongoose";

export interface ISearchAlert extends Document {
  userId: mongoose.Types.ObjectId;
  fromCity: string;
  toCity: string;
  createdAt: Date;
  updatedAt: Date;
}

const SearchAlertSchema = new Schema<ISearchAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
  },
  { timestamps: true }
);

// Keep only last 3 search alerts per user
SearchAlertSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ISearchAlert>("SearchAlert", SearchAlertSchema);
