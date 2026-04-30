// ================= CONFIG =================
const API_KEY = "63121c299d683d0602b629b9344076e2";  
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ================= DOM =================
const m1 = document.getElementById("m1");
const m2 = document.getElementById("m2");
const m3 = document.getElementById("m3");

const letsGo = document.querySelector(".go");
const back = document.getElementById("Back");
const searchBtn = document.querySelector(".search");
const input = document.querySelector(".input");
const slider = document.querySelector(".check");

const tempEl = document.getElementById("temp");
const cityName = document.getElementById("cityName");
const windSpeed = document.getElementById("windSpeed");
const humidPer = document.getElementById("humidPer");
const desc = document.getElementById("desc");
const msg = document.getElementById("msg");
const icon = document.getElementById("clear");

let currentData = null;
let isCelsius = true;

// ================= HELPERS =================
const kelvinToC = (k) => Math.round(k - 273.15);
const kelvinToF = (k) => Math.round((k - 273.15) * 1.8 + 32);

function setIcon(condition) {
  const map = {
    Haze: "images/haze.png",
    Clear: "images/clear.png",
    Clouds: "images/clouds.png",
    Drizzle: "images/drizzle.png",
    Mist: "images/mist.png",
    Fog: "images/mist.png",
    Rain: "images/rain.png",
    Snow: "images/snow.png",
    Thunderstorm: "images/thunderstorm.png",
  };
  icon.src = map[condition] || "images/clear.png";
}

function showError(message) {
  m2.classList.add("inactive");
  m3.classList.remove("inactive");
  msg.innerText = message;
}

function showWeather(data) {
  currentData = data;

  const temp = isCelsius
    ? kelvinToC(data.main.temp) + "°C"
    : kelvinToF(data.main.temp) + "°F";

  tempEl.innerText = temp;
  cityName.innerText = `${data.name}, ${data.sys.country}`;
  windSpeed.innerText = `${data.wind.speed} km/h`;
  humidPer.innerText = `${data.main.humidity}%`;
  desc.innerText = data.weather[0].main;

  setIcon(data.weather[0].main);
}

// ================= API =================
async function fetchWeatherByCity(city) {
  if (!city) return;

  try {
    const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}`);
    const data = await res.json();

    if (data.cod !== 200) {
      showError("City not found");
      return;
    }

    m3.classList.add("inactive");
    m2.classList.remove("inactive");
    showWeather(data);
  } catch (err) {
    showError("Network error. Try again.");
  }
}

async function fetchWeatherByLocation(lat, lon) {
  try {
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const data = await res.json();

    showWeather(data);
  } catch (err) {
    showError("Failed to get location weather");
  }
}

// ================= EVENTS =================
letsGo.addEventListener("click", () => {
  m1.classList.add("inactive");
  m2.classList.remove("inactive");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeatherByLocation(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      showError("Location permission denied");
    }
  );
});

searchBtn.addEventListener("click", () => {
  fetchWeatherByCity(input.value.trim());
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchWeatherByCity(input.value.trim());
  }
});

slider.addEventListener("change", () => {
  isCelsius = !slider.checked;
  if (currentData) showWeather(currentData);
});

back.addEventListener("click", () => {
  m3.classList.add("inactive");
  m1.classList.remove("inactive");
  input.value = "";
});
 