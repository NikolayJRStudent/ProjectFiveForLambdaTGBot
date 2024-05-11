

require = require('esm')(module);

require('dotenv').config();

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const fetchWeatherData = require('./fetchWeatherData.mjs');
const formatWeatherForecast = require('./formatWeatherForecast.mjs');
const TelegramBot = require('node-telegram-bot-api');
const pkg = require('node-persist');
const { init, getItem, setItem } = pkg;



let intervalId;

let intervalInHours = 3;

pkg.init({ dir: 'persist' }).then(() => {
    console.log('Storage initialized successfully');
}).catch(error => {
    console.error('Error initializing storage:', error);
});







const bot = new TelegramBot(token, { polling: true });


const lat = '49.52372';
const lon = '23.98522';
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ua`;



bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await pkg.setItem('chatId', chatId);


    
    bot.sendMessage(chatId, 'Выберите действие:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Weather forecast in Mykolaiv', callback_data: 'Mykolaiv' }]
            ]
        }
    });
});


bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    await pkg.setItem('chatId', chatId);


    
    if (action === 'Mykolaiv') {
        
        bot.sendMessage(chatId, 'Выберите интервал прогноза:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'With a 3-hour interval', callback_data: '3hours' }],
                    [{ text: 'With a 6-hour interval', callback_data: '6hours' }]
                ]
            }
        });
    }

    clearInterval(intervalId);
    console.log('Interval clear');
    if (action === '3hours') {
        intervalInHours = 3; 
        bot.sendMessage(chatId, 'Вы выбрали прогноз погоды с интервалом в 3 часа');
        console.log('Пользователь выбрал прогноз с интервалом 3 часа.');
    }

    
    if (action === '6hours') {
        intervalInHours = 6; 
        bot.sendMessage(chatId, 'Вы выбрали прогноз погоды с интервалом в 6 часов');
        console.log('Пользователь выбрал прогноз с интервалом 6 часов.');
    }
    

    intervalId = setInterval(async () => {
        const chatId = await pkg.getItem('chatId');
        fetchWeatherData(url)
            .then(weatherData => {
                const formattedForecast = formatWeatherForecast(weatherData);
                bot.sendMessage(chatId, formattedForecast);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }, intervalInHours * 60 * 60 * 1000);

});





