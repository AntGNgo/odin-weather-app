// Geocoding on search
// Should run fetch to the API when user stops typing for 1 second

const search = document.getElementById('search');
const searchResults = document.getElementById('search-results');

const background = document.getElementById('background');
const cityName = document.getElementById('city-name');
const sky = document.getElementById('sky');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feels-like');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');

navigator.geolocation.getCurrentPosition(async (pos) => {
	const query = `https://api.openweathermap.org/geo/1.0/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&limit=1&appid=0a6c8ce58f0b5edd77314c1649d29581`;
	const response = await fetch(query, { mode: 'cors' });
	const json = await response.json();
	console.log(json[0].name);
	fetchCityWeather(json[0], pos.coords.latitude, pos.coords.longitude);
});

const fetchCoordinates = async (city) => {
	if (city.trim === '') {
		return;
	}
	const encodedCity = encodeURIComponent(city.trim());
	const query = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=5&appid=0a6c8ce58f0b5edd77314c1649d29581`;
	const response = await fetch(query, { mode: 'cors' });
	const json = await response.json();
	console.log(json);
	return json;
};

const renderSearchResults = (results) => {
	console.log(results);
	results.forEach((result) => {
		if (!result.state) {
			return;
		}
		const li = document.createElement('li');
		li.textContent = `${result.name}, ${result.state}`;
		li.addEventListener('click', () => {
			fetchCityWeather(result, result.lat, result.lon);
		});
		searchResults.appendChild(li);
	});
};

// Debouncing the search input field
let coordinateTimer;
const debounceCoordinates = (event) => {
	clearTimeout(coordinateTimer);

	coordinateTimer = setTimeout(() => {
		const inputValue = event.target.value;
		fetchCoordinates(inputValue).then((coordinates) => {
			renderSearchResults(coordinates);
		});
	}, 1000);
};
search.addEventListener('input', debounceCoordinates);

const fetchCityWeather = async (name, lat, lon) => {
	const query = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=0a6c8ce58f0b5edd77314c1649d29581`;

	const response = await fetch(query, { mode: 'cors' });
	const json = await response.json();
	renderWeatherInfo(name, json);
};

const renderWeatherInfo = (result, weather) => {
	const condition = weather.weather[0].main;
	console.log(weather);
	searchResults.textContent = '';
	search.value = '';
	cityName.textContent = `${result.name}, ${result.state}`;
	sky.textContent = `${condition}`;
	temp.textContent = `${Math.round(weather.main.temp)}°F`;
	feelsLike.textContent = `Feels like: ${Math.round(
		weather.main.feels_like
	)}°F`;
	wind.textContent = `Wind: ${Math.round(weather.wind.speed)}mph`;
	humidity.textContent = `Humidity: ${weather.main.humidity}%`;

	if (condition === 'Squail' || condition === 'Ash') {
		background.style.backgroundImage = `url('./assets/thunder.jpg)`;
	} else {
		console.log(condition.toLowerCase());
		background.style.backgroundImage = `url('./assets/${condition.toLowerCase()}.jpg')`;
	}
};
