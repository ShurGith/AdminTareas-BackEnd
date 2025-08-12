import mongoose, { Schema , Document } from "mongoose";

export type ProjectType = Document & {
	projectName: string;
  clientName: string;
	description: string;
};

const ProjectSchema = new Schema({
	projectName: {type:String},
	clientName:{type:String},
	description:{type:String}
})