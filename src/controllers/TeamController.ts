import { Request, Response } from "express";
import User from "../models/Users";
import Project from "../models/Project";
export class TeamMemberController {
  static async findUserByEmail(req: Request, res: Response) {
    const { email } = req.body;
    const { projectId } = req.params;

    const user = await User.findOne({ email }).select('_id name email');
    const project = await Project.findOne({_id:projectId}).select('manager')


    if (!user) {
      const error = new Error('Usuario no encontrado.');
      res.status(404).json({ error: error.message });
      return
    }
    res.json({ user, project })
  }

  static getProjectTeam = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.project.id).populate({
        path: 'team',
        select: 'id email name',
      });

      res.json(project.team);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };
  static async addMemberById(req: Request, res: Response) {
    const { id } = req.body;
    const user = await User.findById(id).select('_id');

    if (!user) {
      const error = new Error('Usuario no encontrado');
      return res.status(404).json({ error: error.message });
    }

    if (req.project.manager.toString() === id) {
      const error = new Error('El usuario es el manager y  miembro del proyecto. ');
      return res.status(409).json({ error: error.message });
    }

    if (req.project.team.includes(id)) {
      const error = new Error('El usuario ya es miembro del equipo del proyecto.');
      return res.status(409).json({ error: error.message });
    }

    req.project.team.push(user.id);
    await req.project.save();
    res.status(201).send('Usuario añadido al equipo.');
  }

  static async removeMemberById(req: Request, res: Response) {
    const { userId } = req.params;
    if (!req.project.team.some(memberId => memberId.toString() === userId)) {
      const error = new Error('El usuario no es miembro del equipo del proyecto.');
      return res.status(404).json({ error: error.message });
    }

    req.project.team = req.project.team.filter(memberId => memberId.toString() !== userId);
    await req.project.save();
    res.status(200).send('Usuario eliminado del equipo.');
  }

}
