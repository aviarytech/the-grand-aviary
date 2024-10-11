//this is the model or schema of visitor
import { InferSchemaType, model, Schema } from "mongoose";

//visitor schema
const visitorSchema = new Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email: {type: String, required: true },
    description: {type: String },
}, { timestamps: true }); // this adds the created or updated times

type Visitor = InferSchemaType<typeof visitorSchema>;

export default model<Visitor>("Visitor", visitorSchema);