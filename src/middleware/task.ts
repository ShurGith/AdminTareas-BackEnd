import type { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error('Tarea no encontrada');
      return res.status(404).json({ error: error.message })
    }
      req.task = task
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la tarea" });

  }
}

export async function hasAthorization(req: Request, res: Response, next: NextFunction) {
  if(req.user._id.toString() !== req.project.manager.toString()) {
    const error = new Error("No tienes permisos para editar esta tarea");
    return res.status(401).json({ error: error.message });
  }
  next();
}