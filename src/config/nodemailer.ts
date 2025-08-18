import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//const TOKEN = "2337f56db7b617349d682a0925d7933e";

const config = () => {
  return {
    // Looking to send emails in production? Check out our Email API/SMTP product!

    host: process.env.SMPT_HOST ,
    port: +process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASS,
    }
  }
}

export const transporter = nodemailer.createTransport(config());



/*   
SMPT_HOST = sandbox.smtp.mailtrap.io
SMPT_PORT = 2525
SMPT_USER = b626722efe11ef
SMPT_PASS = 76cd5cf9dce1c0

*/