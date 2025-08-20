import mongoose, { Schema, Document, Types }  from "mongoose"

export interface IUser extends Document {
  _id:Types.ObjectId;
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
})

const User = mongoose.model<IUser>("User", UserSchema)
export default User;