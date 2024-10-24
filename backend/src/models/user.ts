import mongoose, { Schema, Document} from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  access_token?: string;
  picture?: string;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  access_token: { type: String },
  picture: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;

