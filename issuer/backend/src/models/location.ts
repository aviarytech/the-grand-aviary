import mongoose, { InferSchemaType, Schema } from "mongoose";

const locationSchema = new Schema({
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String },
    createdBy: { type: String, ref: 'User', required: true }, 
}, { timestamps: true });

type Location = InferSchemaType<typeof locationSchema>;

export default mongoose.model<Location>("Location", locationSchema);
