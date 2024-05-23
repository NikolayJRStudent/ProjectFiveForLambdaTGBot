import axios from 'axios';

import formatWeatherForecast from "./formatWeatherForecast.mjs";


const handleSocketEvents = async (io, pkg, bot, url) => {
  console.log('Запуск прогноза погоды');

 
    const chatId = await pkg.getItem("chatId");
    axios.get(url)
      .then((response) => {
        const weatherData = response.data;
        const formattedForecast = formatWeatherForecast(weatherData);
        bot.sendMessage(chatId, formattedForecast);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  
};

export default handleSocketEvents;