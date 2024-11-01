import mongoose, { InferSchemaType, Schema } from "mongoose";

const visitorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, ref: 'User', required: true },

}, { timestamps: true });

type Visitor = InferSchemaType<typeof visitorSchema>;

export default mongoose.model<Visitor>("Visitor", visitorSchema);
