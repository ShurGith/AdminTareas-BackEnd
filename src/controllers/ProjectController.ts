import { Request, Response } from 'express';
import Project from '../models/Project';
export class ProjectController {
  //& Métodos del controlador de proyectos
  //& Estos métodos manejan las operaciones CRUD para los proyectos
  //& Se asume que el usuario está autenticado y se asigna el manager del proyecto
  //& al usuario autenticado que realiza la solicitud
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
      const projects = await Project.find({
        $or: [
          { manager: req.user?._id }, // Proyectos en los que el usProyectos en los que el usuario está asignado a alguna tarea
        ],
      });
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
      if (project.manager.toString() !== req.user?._id.toString()) {
        const error = new Error("Acceso denegado");
        return res.status(403).json({ error: error.message });
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
      if (project.manager.toString() !== req.user?._id.toString()) {
        const error = new Error("Solo el manager del proyecto puede actualizarlo");
        return res.status(403).json({ error: error.message });
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
      if (project.manager.toString() !== req.user?._id.toString()) {
        const error = new Error("Solo el manager del proyecto puede eliminar el proyecto");
        return res.status(403).json({ error: error.message });
      }

      await project.deleteOne();
      res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
  }
}
