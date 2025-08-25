import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from 'mongoose';

type NoteParams = {
	noteId:Types.ObjectId;
};
export class NoteController {
  static async createNote(req: Request, res: Response) {
    try {
      const { content }: INote = req.body; // Obtener los datos de la nota desde el cuerpo de la solicitud
      const note = new Note()
      note.content = content;
      note.createdBy = req.user.id;
      note.task = req.task.id;
      req.task.notes.push(note.id);
      await Promise.allSettled([note.save(),req.task.save()]);
      res.send("Nota creada exitosamente!"); // Enviar una respuesta con la nota creada como JSON
    } catch (error) {
      res.status(500).json({ error:"Hubo un error al crear la nota" });
    }
  }

  static async getTaskNotes(req: Request, res: Response) {
    try {
      const notes = await Note.find({task:req.task.id  });
      res.json(notes); // Enviar las notas encontradas como JSON en la respuesta
    } catch (error) {
      res.status(500).json({ error:"Hubo un error al obtener las notas" });
    }
  }

  static async deleteNote(req: Request<NoteParams>, res: Response) {        const {noteId} = req.params;
      const note = await Note.findById(noteId);
      if(!note){
        const error = new Error("La nota no existe");
        return res.status(404).json({error:error.message});
      }
      if(note.createdBy.toString() !== req.user.id){
        const error = new Error("No tienes permiso para eliminar esta nota");
        return res.status(401).json({error:error.message}); 
      }
    try {
      await Promise.allSettled([ note.deleteOne(), 
        req.task.updateOne({$pull:{notes:note._id}}),
        res.send("Nota eliminada correctamente")
      ])
    } catch (error) {
      res.status(500).json({ error:"Hubo un error al eliminar la nota" });
    }
  }

}
