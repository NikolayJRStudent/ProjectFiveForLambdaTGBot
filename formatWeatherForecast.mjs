function formatWeatherForecast(weatherData) {
    if (!weatherData || !weatherData.city) {
        return 'Weather data is not available';
    }

    const cityName = weatherData.city.name || 'Unknown City';
    const countryName = weatherData.city.country || 'Unknown Country';
    let formattedForecast = `Погода в ${cityName}:\n`;

    let currentDay = '';
    weatherData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const formattedTime = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        const temp = (item.main.temp - 273.15).toFixed(1);
        const feelsLike = (item.main.feels_like - 273.15).toFixed(1);
        const weatherDescription = item.weather[0].description;

        const day = date.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });

        
        if (day !== currentDay) {
            currentDay = day;
            formattedForecast += `\n${currentDay}:\n`;
        }

        formattedForecast += `${formattedTime}, +${temp}°C, відчувається +${feelsLike}°C, ${weatherDescription}\n`;
    });

    return formattedForecast;
}


export default formatWeatherForecast;