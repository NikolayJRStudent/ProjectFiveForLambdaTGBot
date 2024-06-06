
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';



const app = express(); 
const http = createServer(app);


const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT;
http.listen(port, () => {
  console.log(`The socket server is running on the port ${port}`);
});

app.get('/', (req, res) => {
  res.send('The server is running!');
});


io.on('connection', (socket) => {
  console.log('Connecting to a socket');
  
  const keepAliveInterval = setInterval(() => {
    socket.emit('keep-alive');
  }, 4 * 60 * 1000);
  
  socket.on('disconnect', () => {
    console.log('Disconnecting from a socket');
    clearInterval(keepAliveInterval);
  });

  
});



