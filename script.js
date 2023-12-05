// Geocoding on search
// Should run fetch to the API when user stops typing for 1 second

const search = document.getElementById('search');

const fetchCoordinates = async (city) => {
	if (city.trim === '') {
		return;
	}
	const encodedCity = encodeURIComponent(city);
	const query = `http://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=5&appid=0a6c8ce58f0b5edd77314c1649d29581`;
	const response = await fetch(query, { mode: 'cors' });
	const json = await response.json();
	console.log(json);
};

fetchCoordinates('San Jose');

let coordinateTimer;

const debounceCoordinates = (event) => {
	clearTimeout(coordinateTimer);

	coordinateTimer = setTimeout(() => {
		const inputValue = event.target.value;
		fetchCoordinates(inputValue);
	}, 1000);
};

search.addEventListener('input', debounceCoordinates);
