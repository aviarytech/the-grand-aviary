//this is the model or schema of the entity/note
import { InferSchemaType, model, Schema } from "mongoose";

//here will be the entity ----this will change in final copy
const noteSchema = new Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email: {type: String, required: true },
    description: {type: String },
}, { timestamps: true });//this last line adds the created or updated times

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema)