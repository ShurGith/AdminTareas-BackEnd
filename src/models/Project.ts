import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./Users";

export type ProjectType = Document & {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<ITask & Document>[];
	manager: PopulatedDoc<IUser & Document>;
	team: PopulatedDoc<IUser & Document>[];
};

const ProjectSchema = new Schema({
	projectName: {
		type: String,
		reuired: true,
		trim: true
	},
	clientName: {
		type: String,
		reuired: true,
		trim: true
	},
	description: {
		type: String,
		reuired: true,
		trim: true
	},
	tasks: [
		{
			type: Types.ObjectId,
			ref: "Task"
		}
	],
	manager: {
		type: Types.ObjectId,
		ref: "User",
		required:true
	},
	team: [
		{
			type: Types.ObjectId,
			ref: "User"
		}
	]
},
	{ timestamps: true }
)

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;