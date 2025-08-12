import mongoose, { Schema, Document } from "mongoose";

export type ProjectType = Document & {
	projectName: string;
	clientName: string;
	description: string;
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
})

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;