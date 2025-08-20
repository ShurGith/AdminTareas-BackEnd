import { Request, Response } from 'express';
import Project from '../models/Project';
export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    project.manager = req.user?._id; // Asignar el usuario autenticado como manager del proyecto
    try {
      await project.save();
      console.log(project);
      return res.status(201).json(project);
    } catch (error) {
      console.log(error);
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate('tasks');
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      res.json(project);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al obtener el proyecto" });
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error('Proyecto no encontrado');
        res.status(404).json({ error: error.message });
        return;
      }
      project.clientName = req.body.clientName ;
      project.projectName = req.body.projectName;
      project.description = req.body.description;
      await project.save();
      res.json({ message: 'Proyecto actualizado correctamente', project });
    }
    catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error('Proyecto no encontrado');
        res.status(404).json({ error: error.message });
        return;
      }

      await project.deleteOne();
      res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
  }
}
