import mongoose, { Schema, Document, Types }  from "mongoose"

export interface IToken extends Document {
  token: string
  user: Types.ObjectId 
  createdAt: Date
}

const TokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
    user: {
    type: Types.ObjectId ,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m', // Token will expire after 1 hour
  },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);
export default Token;