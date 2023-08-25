const apiKey = '0076f5c2e949981a7dac2b6129a7fd47';
const cityNames = ['London', 'New York', 'Los Angeles', 'Tokyo', 'Lagos'];

const citySearchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.querySelector('.city-name');
const weatherIcon = document.querySelector('.weather-icon i');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const forecastDaysContainer = document.querySelector('.forecast-days');

let currentCityIndex = 0;

async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function generateForecastData(currentWeather) {
  const forecastData = [];

  for (let i = 1; i <= 5; i++) {
    const forecastDay = {
      day: getDayOfWeek(i),
      icon: getForecastIcon(currentWeather.weather[0].main),
      temp: `${Math.round(currentWeather.main.temp) + i}°C`
    };
    forecastData.push(forecastDay);
  }

  return forecastData;
}

function getDayOfWeek(offset) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const targetDay = new Date(today);
  targetDay.setDate(today.getDate() + offset);
  return daysOfWeek[targetDay.getDay()];
}

function getForecastIcon(weatherCondition) {
  if (weatherCondition === 'Clear') {
    return 'fas fa-sun';
  } else if (weatherCondition === 'Clouds') {
    return 'fas fa-cloud';
  } else if (weatherCondition === 'Rain') {
    return 'fas fa-cloud-showers-heavy';
  }
  return 'fas fa-cloud';
}

function updateWeatherUI(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.className = getForecastIcon(data.weather[0].main);
}

function updateForecastUI(currentWeather) {
  const forecastData = generateForecastData(currentWeather);

  forecastDaysContainer.innerHTML = '';
  forecastData.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');
    dayElement.innerHTML = `
      <div class="forecast-icon">
        <i class="${day.icon}"></i>
      </div>
      <div class="forecast-day-name">${day.day}</div>
      <div class="forecast-temp">${day.temp}</div>
    `;
    forecastDaysContainer.appendChild(dayElement);
  });
}

function updateCityWeather() {
  fetchWeather(cityNames[currentCityIndex])
    .then(data => {
      updateWeatherUI(data);
      updateForecastUI(data);
    })
    .catch(error => console.error('Error fetching weather:', error));
}

function searchCityWeather() {
  const searchCity = citySearchInput.value.trim();
  if (searchCity !== '') {
    fetchWeather(searchCity)
      .then(data => {
        updateWeatherUI(data);
        updateForecastUI(data);
      })
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