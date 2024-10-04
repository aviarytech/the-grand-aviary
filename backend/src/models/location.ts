//this is the model or schema of the locations
import { InferSchemaType, model, Schema } from "mongoose";

//here will be the entity 
const locationSchema = new Schema({
    address: { type: String, required: true },
    latitude:  { type: Number, required: true },
    longitude: {type: Number, required: true },
    description: {type: String },
}, { timestamps: true });//this last line adds the created or updated times

type Location = InferSchemaType<typeof locationSchema>;

export default model<Location>("Location", locationSchema)