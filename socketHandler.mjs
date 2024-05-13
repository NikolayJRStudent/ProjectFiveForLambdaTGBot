


const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('Подключение сокета:', socket.id);

    socket.on('startForecast', () => {
      console.log('Запуск прогноза погоды');
      // В этом месте вы можете выполнить задачу отправки прогноза погоды
    });
  });
};

module.exports = handleSocketEvents;