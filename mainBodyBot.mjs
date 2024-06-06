import pkg from "node-persist";
import io from "socket.io-client";
import TelegramBot from "node-telegram-bot-api";
import handleCallbackQuery from "./handleCallbackQuery.mjs";
import handleSocketEvents from "./socketHandler.mjs";
import dotenv from "dotenv";

dotenv.config();

// Ініціалізація node-persist
await pkg.init();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const socket = io(`https://prong-helix-crater.glitch.me`);

const apiKey = process.env.API_KEY;
const lat = "49.52372";
const lon = "23.98522";
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ua`;

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Збереження chatId в node-persist
  await pkg.setItem("chatId", chatId);

  bot.sendMessage(chatId, "Choose an action:", {
    reply_markup: {
      keyboard: [
        [{ text: "Weather forecast in Mykolaiv" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Обробка текстових повідомлень від користувача
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'Weather forecast in Mykolaiv') {
    await bot.sendMessage(chatId, "Select forecast interval:", {
      reply_markup: {
        keyboard: [
          [{ text: "With a 3-hour interval" }],
          [{ text: "With a 6-hour interval" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    
  } else if (text === 'With a 3-hour interval' || text === 'With a 6-hour interval') {
    const interval = text === 'With a 3-hour interval' ? '3hours' : '6hours';
    const callbackQuery = { message: { chat: { id: chatId } }, data: interval };
    const { intervalId, intervalInHours } = await handleCallbackQuery(bot, callbackQuery);

    await bot.sendMessage(chatId, `You have selected a weather forecast with an interval of ${intervalInHours} hours.`, {
      reply_markup: {
        keyboard: [
          [{ text: "With a 3-hour interval" }],
          [{ text: "With a 6-hour interval" }]
        ]
      }
    });

    setInterval(async () => {
      await handleSocketEvents(io, pkg, bot, url);
    }, intervalInHours * 60 * 60 * 1000);
  }
});

socket.on("keep-alive", () => {
  console.log("Session extension");
});
