import pkg from "node-persist";
import io from "socket.io-client";

import TelegramBot from "node-telegram-bot-api";
import handleCallbackQuery from "./handleCallbackQuery.mjs";
import handleSocketEvents from "./socketHandler.mjs";
import dotenv from "dotenv";


const port = process.env.PORT || 3000;

const socket = io(`http://localhost:${port}`);



dotenv.config();

const apiKey = process.env.API_KEY;
const lat = "49.52372";
const lon = "23.98522";
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ua`;

// Инициализация node-persist
const { init, setItem } = pkg;
init({ dir: "persist" })
  .then(() => {
    console.log("Storage initialized successfully");
  })
  .catch((error) => {
    console.error("Error initializing storage:", error);
  });

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Обработка команды /start от пользователя
bot.onText(/\/start/, async (msg) => {
  
  const chatId = await pkg.getItem('chatId');
  await pkg.setItem('chatId', chatId);
  bot.sendMessage(chatId, "Выберите действие:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Weather forecast in Mykolaiv", callback_data: "Mykolaiv" }],
      ],
    },
  });
});

// Обработка события callback_query от пользователя
bot.on("callback_query", async (callbackQuery) => {
  // Обработка callback_query
  let { intervalId, intervalInHours } = await handleCallbackQuery(
    bot,
    pkg,
    callbackQuery
  );
  intervalId = setInterval(async () => {
    await handleSocketEvents(io, pkg, bot, url);
  }, 2 * 60 * 60 * 1000);
});

socket.on("keep-alive", () => {
  console.log("Продлление сессии");
});







