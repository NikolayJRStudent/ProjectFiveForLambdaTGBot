import axios from 'axios';
import formatWeatherForecast from "./formatWeatherForecast.mjs";

const handleSocketEvents = async (io, pkg, bot, url) => {
  console.log('Launch a weather forecast');

  try {
    const chatId = await pkg.getItem("chatId");
    if (!chatId) {
      throw new Error("Chat ID not found in storage");
    }

    const response = await axios.get(url);
    const weatherData = response.data;
    const formattedForecast = formatWeatherForecast(weatherData);
    await bot.sendMessage(chatId, formattedForecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export default handleSocketEvents;
