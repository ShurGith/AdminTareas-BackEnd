import { transporter } from '../config/nodemailer'

interface IEmail {
  email: string;
  token: string;
  name: string;
  title?: string;
  subject?: string;
}

const validateTokenTime = +process.env.VALIDATE_TOKEN / 60 || "10";
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    try {
      const subject = user.subject || "AdminTareas - Confirmacion de cuenta";
      const title = user.title || "¡Bienvenido a AdminTareas!";

      await transporter.sendMail({
        from: 'AdminTareas" <admin@admintareas.com>',
        to: user.email,
        subject: subject ,
        text: `Hola ${user.name}, confirma tu cuenta en AdminTareas, Tu token de confirmación es: ${user.token}`,
        html: `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #444; text-align: center;">${title}, ${user.name}!</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
                    Has creado tu cuenta en <strong>UpTask</strong>
                    , ¡ya casi está todo listo! Solo debes confirmar tu cuenta para poder comenzar a usarla.
                    </p> 
                    <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
                      Para confirmar tu cuenta, visita el  siguiente enlace:
                    </p> 
                    <div style="text-align: center; margin: 20px 0;"> 
                      <a href=${process.env.FRONTEND_URL}/auth/confirm-account style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
                        Confirmar Cuenta
                      </a>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                      E ingresa el siguiente código para confirmar tu cuenta:
                    </p>
                    <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
                      ${user.token.trim()}
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                      <strong>Nota:</strong> Este token expira en ${validateTokenTime} minutos.
                    </p> 
                    <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;">
                      Si no has solicitado esta cuenta, puedes ignorar este mensaje.
                    </p>
                  </div>
              </div> `
      })
    } catch (error) {
      throw new Error('Failed to send confirmation email');
    }
  }

static sendPasswordResetToken = async (user: IEmail) => {
    try {
      const title = "¡Restablecimiento de contraseña en AdminTareas!";

      await transporter.sendMail({
        from: 'AdminTareas" <admin@admintareas.com>',
        to: user.email,
        subject: "UpTask - Restablecimiento de contraseña",
        text: "UpTask - Restablecimiento de contraseña",
        html: `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #444; text-align: center;">${title}, ${user.name}!</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
                    Has solicitado restablecer tu password en <strong>UpTask</strong>, ¡ya casi está todo listo! Solo debes confirmar tu cuenta para poder comenzar a usarla.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                      Para restablecer tu contraseña, ingresa al siguiente link y sigue las instrucciones:
                    <div style="text-align: center; margin: 20px 0;"> 
                    </p> 
                    <div style="text-align: center; margin: 20px 0;"> 
                      <a href=${process.env.FRONTEND_URL}/auth/new-password style="display: inline-block; padding: 10px 20px; background-color: #FE9900; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
                        Restablecer Contraseña
                      </a>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                      También puedes ingresar el siguiente código para confirmar tu cuenta: 
                    </p>
                    <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
                      ${user.token.trim()}
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">
                      <strong>Nota:</strong> Este token expira en ${validateTokenTime} minutos.
                    </p> 
                    <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;">
                      Si no has solicitado esta cuenta, puedes ignorar este mensaje.
                    </p>
                  </div>
              </div> `
      })
    } catch (error) {
      throw new Error('Failed to send confirmation email');
    }
  }



}