const form = document.querySelector("form");
const weather = document.querySelector("#weather");

async function getWeatherData(location) {
  const API_KEY = "SN26AF45CBKVYDMW2TVU8QSHX";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayDataWeather(data, location);
  } catch (err) {
    console.log("Failed to fetch weather data:", err);
  }
}

function displayDataWeather(data, location) {
  const { temp, humidity, description } = data.days[0];
  weather.innerHTML = `
    <h2>Todays Weather in ${location}</h2>
    <p>Temp: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>${description}</p>
  `;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = form.location.value;
  getWeatherData(location);
  form.reset();
});
