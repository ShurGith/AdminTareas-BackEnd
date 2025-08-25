import e from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

export const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed"
} as const;

export const taskStatusEnum = Object.values(taskStatus);
export type taskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: taskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: taskStatus;
  }[]
  notes: Types.ObjectId[];
}

export const TaskSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please add a task name"]
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please add a description"]
  },
  project: {
    type: Types.ObjectId,
    ref: "Project",
    required: true
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },
  completedBy: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
        default: null
      },
      status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
      },
    }],
    notes: [{
      type: Types.ObjectId,
      ref: "Note",
    }]
}, { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;