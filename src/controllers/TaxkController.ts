import { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
  static async createTask(req: Request, res: Response) {

    try {
      const newTask = new Task(req.body)
      newTask.project = req.project.id;
      req.project.tasks.push(newTask.id);
      //& await newTask.save();//Guarda en la base de datos la tarea y el id del proyecto a la que pertenece
      //& await req.project.save();//Guarda en la base de datos el proyecto con su nueva tarea
      //$ Promise.allSettled espera hasta que todas las promesas se hayan cumplido o rechazado
      await Promise.allSettled([req.project.save(), newTask.save()]);

      return res.send('Tarea creada correctamente');
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({
        project: req.project.id,
      }).populate("project");
      return res.json(tasks);
    }
    catch (error) {
      return res.status(401).send({ message: "Error al obtener las tareas" });
    }
  }


  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        const error = new Error("No existe una tarea con ese ID");
        return res.status(404).json({error: error.message});
      }
      if(task.project.toString() !== req.project.id){
        const error = new Error("La tarea no pertenece al proyecto");
        return res.status(400).json({error: error.message});
      }
      res.json(task);
    }
    catch (error) {
      return res.status(401).send({ message: "Error al obtener la tarea" });
    }
  }
}
