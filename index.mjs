
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';


// Инициализация приложения Express и создание HTTP-сервера
const app = express(); 
const http = createServer(app);

// Создание экземпляра сокета
const io = new Server(http);

// Установка порта для прослушивания HTTP-сервера
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Сервер с сокетами запущен на порту ${port}`);
});

io.on('connection', (socket) => {
  console.log('Подключение к сокету');
  
  const keepAliveInterval = setInterval(() => {
    socket.emit('keep-alive');
  }, 5* 60 * 1000);
  
  socket.on('disconnect', () => {
    console.log('Отключение от сокета');
    clearInterval(keepAliveInterval);
  });

  
});



