import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";

export type ProjectType = Document & {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<ITask & Document>[];

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
	]
},
	{ timestamps: true }
)

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;