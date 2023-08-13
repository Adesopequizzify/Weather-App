const apiKey = '';
const cityNames = ['London', 'New York', 'Los Angeles', 'Tokyo', 'Lagos'];

const citySearchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.querySelector('.city-name');
const weatherIcon = document.querySelector('.weather-icon i');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');

let currentCityIndex = 0;

async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function updateWeatherUI(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;

  const weatherCondition = data.weather[0].main;
  if (weatherCondition === 'Clear') {
    weatherIcon.className = 'fas fa-sun';
  } else if (weatherCondition === 'Clouds') {
    weatherIcon.className = 'fas fa-cloud';
  } else if (weatherCondition === 'Rain') {
    weatherIcon.className = 'fas fa-cloud-showers-heavy';
  }
}

function updateCityWeather() {
  fetchWeather(cityNames[currentCityIndex])
    .then(data => updateWeatherUI(data))
    .catch(error => console.error('Error fetching weather:', error));
}

function searchCityWeather() {
  const searchCity = citySearchInput.value.trim();
  if (searchCity !== '') {
    fetchWeather(searchCity)
      .then(data => updateWeatherUI(data))
      .catch(error => console.error('Error fetching weather:', error));
  }
}

searchBtn.addEventListener('click', searchCityWeather);

function updateCitiesEvery30Seconds() {
  setInterval(() => {
    currentCityIndex = (currentCityIndex + 1) % cityNames.length;
    updateCityWeather();
  }, 30000);
}

// Initial weather update
window.addEventListener('load', () => {
  updateCityWeather();
  updateCitiesEvery30Seconds();
});