import { Request, Response } from 'express';
import Task, { taskStatus } from '../models/Task';
import { request } from 'http';


export class TaskController {
  static async createTask(req: Request, res: Response) {

    try {
      const newTask = new Task(req.body)
      newTask.project = req.project.id;
      req.project.tasks.push(newTask.id);
      
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
      const task = await Task.findById(req.task.id).populate({path:"completedBy.user",select:'id name email'})
      res.json(task);
    }
    catch (error) {
      return res.status(401).send({ message: "Error al obtener la tarea" });
    }
  }

  static updateTask = async (req: Request, res: Response) => {
    try {
      if(req.task.project.toString() !== req.project.id){
        const error = new Error("La tarea no pertenece al proyecto");
        return res.status(400).json({error: error.message});
      }
      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();

      return res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({error:"Hubo un error al actualizar la tarea"});
    }
  }
  
  static deleteTask = async (req: Request, res: Response) => {
    try{
      if(req.task.project.toString() !== req.project.id){
        const error = new Error("La tarea no pertenece al proyecto");
        return res.status(400).json({error: error.message});
      }
      req.project.tasks = req.project.tasks.filter( task => req.task.toString() !== req.task.id.toString());
      await Promise.allSettled([req.project.save(), req.task.deleteOne()]);
      return res.send("Tarea eliminada correctamente");
    }catch(error){
      console.log(error);
      res.status(500).json({message:"Hubo un error al eliminar la tarea"})
    }
  }

  static updateTaskStatus = async (req:Request,res:Response)=>{
    try{
      const {status} = req.body; 
      req.task.status=status;
      const data={
        user:req.user.id,
        status //El que se pasa en el request body
      }
  /*    if(status === taskStatus.PENDING)
        req.task.completedBy=null;
      else
        req.task.completedBy = req.user.id;*/
      req.task.completedBy.push(data);
      await req.task.save();

      return res.send("Estado de la tarea actualizado correctamente");

    }catch(error){
      console.log(error);
      res.status(500).json({message:"Hubo un error al actualizar el estado de la tarea"})
    }
  }
  
}
