import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js'

const app =  express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configurar carpeta public
app.use(express.static('src/public'));

// Configuraciones de handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', viewsRouter);


const serverExp = app.listen(8080, () => {
    console.log("Servidor ON en puerto 8080");
});

const socketServer = new Server(serverExp);
socketServer.on('connection', (socket) => {
    console.log('Se conectó alguien por websocket:', socket.id);
    socket.emit('saludo', 'Te saludo desde muy lejos');
});