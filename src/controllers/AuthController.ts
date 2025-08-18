import type { Request, Response } from 'express';
import User from '../models/Users';
import { hashPassword, checkPassword } from '../utils/auth';
import Token from '../models/Token';
import { genterateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
  //? Crear cuenta 
  static createAcount = async (req: Request, res: Response) => {
    try {
      const { password, email, name } = req.body;
      // Prevenir duplicados de usuarios con el mismo correo electrónico
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(409).json({ error: 'Ya existe una cuenta con ese correo electrónico.' });
        return;
      }
      const user = new User(req.body);
      user.password = await hashPassword(password);
      //Generar token de confirmación
      const token = new Token()
      token.token = genterateToken();
      token.user = user.id;

      // Enviar el token al correo electrónico del usuario
      await AuthEmail.sendConfirmationEmail({ email: email, token: token.token, name: name });
      // Guardar el usuario y el token en la base de datos
      await Promise.allSettled([user.save(), token.save()]);
      res.status(201).send("Cuenta creada correctamente, por favor confirme su cuenta en el email que te hemos enviado.");
      return;
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
  //? Confirmar cuenta 
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      const user = await User.findById(tokenExist.user);

      //! Manejo de errores 
      if (!tokenExist) {
        const error = new Error('Token inválido o expirado.');
        return res.status(404).json({ error: error.message });
      }
      if (!user) {
        const error = new Error('Usuario no encontrado.');
        return res.status(404).json({ error: error.message });
      }
      if (user.confirmed) {
        const error = new Error('La cuenta ya ha sido confirmada.');
        return res.status(401).json({ error: error.message });
      }

      //~ Confirmar la cuenta 
      user.confirmed = true;
      await Promise.allSettled([user.save(), Token.deleteOne({ _id: tokenExist._id })]);
      res.status(200).send('Cuenta confirmada correctamente.');

      return res.status(200).json({ message: 'Token válido, puedes proceder a confirmar tu cuenta.' });
    } catch (error) {
      console.error('Error confirming account:', error);
      res.status(500).json({ error: 'Internal server error dfasdf' });
      return;
    }
  }

  //^ Login
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      if (!user.confirmed) {
        const tokenExist = await Token.findOne({ user: user._id });
        let tokenNew = '';
      if (!tokenExist) {
        const token = new Token();
        token.token = genterateToken();
        token.user = user.id;
        tokenNew = token.token; //Para enviar el token al correo electrónico
        await token.save();
      }
        if (tokenExist){  tokenNew= tokenExist.token;}
          //await Token.deleteOne({ _id: tokenExist._id });
          await AuthEmail.sendConfirmationEmail({
            email: user.email, token: tokenNew, name: user.name,
            subject: 'Confirmación de cuenta pendiente',
            title: '¡AdminTareas - Confirmación de cuenta pendiente!'
        })
        console.log('Token de confirmación enviado al correo electrónico del usuario.');
        return res.status(401).json({ error: 'Cuenta no confirmada. Enviado Nuevo Token' });
      }

      //! Revisar password no pasa   
      const passwordMatch = await checkPassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas. Password incorrecto.' });
      }
      //* Si las credenciales son válidas, puedes proceder con la lógica de inicio de sesión
      res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}
