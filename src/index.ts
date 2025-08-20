import colors, { bgBlue } from 'colors';
import server from './server';

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(bgBlue(`Servidor corriendo en el puerto ${port}`));
})