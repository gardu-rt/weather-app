import "./style.css";

const form = document.querySelector("form");
const weather = document.querySelector("#weather");

async function getWeatherData(location) {
  const API_KEY = "SN26AF45CBKVYDMW2TVU8QSHX";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayDataWeather(data, location);
    console.log(data);
  } catch (err) {
    console.log("Failed to fetch weather data:", err);
  }
}

async function displayDataWeather(data, location) {
  const { temp, humidity, description, icon } = data.days[0];
  const Icon = await import(`./img/${icon}.svg`);
  weather.innerHTML = `
    <h2>Todays Weather in ${location}</h2>
    <img src="${Icon.default}" />
    <p>Temp: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>${description}</p>
  `;
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung di browser ini.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          resolve({ latitude, longitude });
        },
        (err) => reject("Fail to get location: " + err.message)
      );
    }
  });
}

async function reverseGeoCode(lat, lon) {
  const apiKey = "20a4e80431ae4c57b53b5265ac196a9d";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data && data.results && data.results.length > 0) {
    return data.results[0].components.village;
  } else {
    throw new Error("There is no such location");
  }
}

async function showWeather() {
  const { latitude, longitude } = await getUserLocation();
  const lokasi = await reverseGeoCode(latitude, longitude);

  getWeatherData(lokasi);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const location = form.location.value;
    getWeatherData(location);
    form.reset();
  });
}

showWeather();
