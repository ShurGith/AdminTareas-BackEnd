import mongoose, { Schema, Document, Types } from "mongoose"

export interface IToken extends Document {
  token: string
  user: Types.ObjectId
  createdAt: Date
}

const tokenLifetimeInSeconds = +process.env.VALIDATE_TOKEN || 600 ; // Default to 10 minutes if not set

const TokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: +tokenLifetimeInSeconds, // Default expiration time
  },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);
export default Token;