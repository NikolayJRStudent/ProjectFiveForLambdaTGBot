async function handleCallbackQuery(bot,  callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;
  

  let intervalId;
  let intervalInHours = 3;

  if (action === "3hours") {
    intervalInHours = 3;
    
    console.log("The user selected a forecast with an interval of 3 hours.");
  } else if (action === "6hours") {
    intervalInHours = 6;
    
    console.log("The user selected a forecast with an interval of 6 hours.");
  }

  return { intervalId, intervalInHours };
}

export default handleCallbackQuery;
