
async function handleCallbackQuery (bot, pkg, callbackQuery){
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;
  await pkg.setItem("chatId", chatId);
  
  let intervalId;
  let intervalInHours = 3; 

  if (action === "Mykolaiv") {
    bot.sendMessage(chatId, "Выберите интервал прогноза:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "With a 3-hour interval", callback_data: "3hours" }],
          [{ text: "With a 6-hour interval", callback_data: "6hours" }],
        ],
      },
    });
  }

  clearInterval(intervalId);
  console.log("Interval clear");
  if (action === "3hours") {
    intervalInHours = 3;
    bot.sendMessage(chatId, "Вы выбрали прогноз погоды с интервалом в 3 часа");
    console.log("Пользователь выбрал прогноз с интервалом 3 часа.");
  }

  if (action === "6hours") {
    intervalInHours = 6;
    bot.sendMessage(chatId, "Вы выбрали прогноз погоды с интервалом в 6 часов");
    console.log("Пользователь выбрал прогноз с интервалом 6 часов.");
  }

  return { intervalId, intervalInHours };
};

export default handleCallbackQuery;

