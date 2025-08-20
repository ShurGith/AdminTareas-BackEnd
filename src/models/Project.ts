import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./Users";

export type ProjectType = Document & {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<ITask & Document>[];
	manager: PopulatedDoc<IUser & Document>;

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
			type: Schema.Types.ObjectId,
			ref: "Task"
		}
	],
	manager: {
		type: Types.ObjectId,
		ref: "User",
		required:true
	}
},
	{ timestamps: true }
)

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;