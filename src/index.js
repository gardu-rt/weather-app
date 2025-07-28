import "./style.css";

const form = document.querySelector("form");
const weather = document.querySelector("#weather");

async function getWeatherData(location) {
  const API_KEY = "SN26AF45CBKVYDMW2TVU8QSHX";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayDataWeather(data);
    console.log(data);
  } catch (err) {
    console.log("Failed to fetch weather data:", err);
  }
}

async function displayDataWeather(data) {
  try {
    const { temp, humidity, conditions, icon } = data.days[0];
    const { resolvedAddress } = data;
    let [a, b, c] = resolvedAddress.split(", ");
    if (!c) c = b;
    const Icon = await import(`./img/${icon}.svg`);
    weather.innerHTML = `
    <h2>${a}, ${c}</h2>
    <div>
      <img src="${Icon.default}" />
      <div>
        <p>${conditions}</p>
        <p>🌡️ ${temp}°C</p>
        <p>💧 ${humidity}%</p>
      </div>
    </div>
  `;
  } catch (err) {
    weather.innerHTML = `<p>❌ Fail to load weather data</p>`;
    console.error(err);
  }
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
    return data.results[0].components.state;
  } else {
    throw new Error("There is no such location");
  }
}

async function showWeather() {
  weather.innerHTML = `
        <div class="spinner"></div>
    `;
  const { latitude, longitude } = await getUserLocation();
  const lokasi = await reverseGeoCode(latitude, longitude);

  getWeatherData(lokasi);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    weather.innerHTML = `
      <div class="loading-box">
        <div class="spinner"></div>
      </div>
    `;
    const location = form.location.value;
    getWeatherData(location);
    form.reset();
  });
}

showWeather();
