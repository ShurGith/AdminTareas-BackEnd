import mongoose from "mongoose";
import colors, {bgMagenta, bgRed} from 'colors';


export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`.bgMagenta);
    } catch (error) {
      console.log(error.message.bgRed);
      console.log("No se pudo conectar a la base de datos - Archivo db.ts ".bgRed);
        process.exit(1);
    }
}