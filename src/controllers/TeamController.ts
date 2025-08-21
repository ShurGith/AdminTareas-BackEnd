import { Request, Response } from "express";
import User from "../models/Users";
import Project from "../models/Project";

export class TeamMemberController {
  static async findUserByEmail(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('_id name email');
    if (!user) {
      const error = new Error('Usuario no encontrado.');
      res.status(404).json({ error: error.message });
      return
    }
    res.json(user)
  }
  static async getProjectTeam(req: Request, res: Response) {
    const projectId = await Project.findById( req.project.id ).populate({
      path:'team',
      select: '_id name email'});
  //  res.status(200).json({ team: projectId.team });
    res.send(projectId.team);
    //
    // const teamMembers = await User.find({ _id: { $in: req.project.team } }).select('_id name email');
    // res.send(teamMembers);
  }

  static async addMemberById(req: Request, res: Response) {
    const { id } = req.body;
    const user = await User.findById(id).select('_id');

    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    if (req.project.manager.toString() === id)
      return res.status(409).json({ message: 'El usuario es el manager del proyecto y ya es miembro del equipo.' });

    if (req.project.team.includes(id))
      return res.status(409).json({ message: 'El usuario ya es miembro del equipo del proyecto.' });

    req.project.team.push(user.id);
    await req.project.save();
    res.status(201).send('Usuario añadido al equipo del proyecto.');
  }

  static async removeMemberById(req: Request, res: Response) {
    const { id } = req.body;
    if (!req.project.team.includes(id))
      return res.status(404).json({ message: 'El usuario no es miembro del equipo del proyecto.' });

    req.project.team = req.project.team.filter(memberId => memberId.toString() !== id);
    await req.project.save();
    res.status(200).send('Usuario eliminado del equipo del proyecto.');
  }

}
