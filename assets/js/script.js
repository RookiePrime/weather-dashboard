const searchContainerEl = document.querySelector("#searchContainer");
const weatherContainerEl = document.querySelector("#weatherContainer");
const searchInputEl = document.querySelector("input[type=search]");
const firstapiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const oneCallapiUrl = "https://api.openweathermap.org/data/2.5/onecall?"
const apiKey = "&appid=b9b5e05331dc05e13390961cd01eb4f8";

const getWeatherData = searchTerm => {
    // If the search term isn't nothing
    if (searchTerm) {
        // First first, we wipe the old data off the page
        weatherContainerEl.innerHTML = "";

        // First we call the weather API, because that one accepts a city name. We do this to find the latitude and longitude to feed to the one call API. I use regular string concatonation here rather than template literals (as in the displayWeather() function) so that it's easier to read all the pieces that go into the URL
        fetch(firstapiUrl + searchTerm + apiKey)
            .then(response => {
                // If this response is legit
                if (response) {
                    response.json().then(data => {
                        // Now the REAL call, using the obtained lat and lon
                        const cityName = data.name;
                        // I fetch in metric, 'cause I live in metric. It's Canada. Come at me. Also, excluding the things I don't need, hopefully speeds up the call?
                        fetch(oneCallapiUrl + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=metric" + "&exclude=minutely,hourly,alerts" + apiKey)
                            .then(secResponse => {
                                // If this REAL response is legit
                                if (secResponse) {
                                    // THEN we use this to display the weather
                                    secResponse.json().then(secData => {
                                        displayWeather(secData, cityName);
                                    });
                                }
                            });
                    });
                }
            });
    }
};

const displayWeather = (weatherData, cityName) => {
    // First, make the boxes that contain all the things
    const cityBoxEl = document.createElement("div");
    const cityNameEl = document.createElement("h2");
    const weatherIconEl = document.createElement("img");
    const cityTempEl = document.createElement("p");
    const cityWindEl = document.createElement("p");
    const cityHumidityEl = document.createElement("p");
    const cityUVEl = document.createElement("p");
    const uvSpanEl = document.createElement("span");
    // Then, give them all their requisite properties, including the text containing the data for the weather for the location searched
    cityBoxEl.className = "row s12";
    cityBoxEl.id = "cityBox"

    cityNameEl.textContent = cityName;
    weatherIconEl.className = "weather-icon";
    weatherIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`);
    cityTempEl.textContent = `Temp: ${weatherData.current.temp} °C`;
    // Calculating km/h first, since it's given in m/s. The convesion is, in fact, a nice clean 3.6. 'Cause metric is cool.
    const windKM = (weatherData.current.wind_speed * 3).toFixed(1);
    cityWindEl.textContent = `Wind: ${windKM} km/h`;
    cityHumidityEl.textContent = `Humidity: ${weatherData.current.humidity} %`;
    // Slightly more complex, for style purposes. The value is in a span so that it can be colour-coded based on intensity
    const uvIndex = weatherData.current.uvi;
    cityUVEl.textContent = "UV Index: "
    uvSpanEl.textContent = uvIndex;

    // I don't know anything about the UV Index and its normal parameters, I'm just gonna go with what I see on Wikipedia for colour-coding, based on the graph there.
    if (uvIndex <= 3) {
        uvSpanEl.className = "green white-text";
    } else if (uvIndex > 3 && uvIndex <= 6) {
        uvSpanEl.className = "yellow white-text";
    } else if (uvIndex > 6 && uvIndex <= 8) {
        uvSpanEl.className = "orange white-text";
    } else if (uvIndex > 8) {
        uvSpanEl.className = "red white-text";
    }

    // Then apply it to the page
    cityNameEl.appendChild(weatherIconEl);
    cityBoxEl.appendChild(cityNameEl);
    cityBoxEl.appendChild(cityTempEl);
    cityBoxEl.appendChild(cityWindEl);
    cityBoxEl.appendChild(cityHumidityEl);
    cityUVEl.appendChild(uvSpanEl);
    cityBoxEl.appendChild(cityUVEl);

    weatherContainerEl.appendChild(cityBoxEl);

    // And finally, make the weather visible
    weatherContainerEl.setAttribute("style", "display: block");

    // Now to make the cards for the next five days
    const fiveDayForecastEl = document.createElement("div");
    const fiveDayH2 = document.createElement("h2");

    fiveDayForecastEl.className = "row s12";
    fiveDayForecastEl.id = "fiveDayForecast";

    fiveDayH2.textContent = "5-Day Forecast:"

    // Now to make each card for the next five days' forecasts. Taking heavily from the Materialize UI example for how to lay it out
    for (let i = 0; i < 5; i++) {
        const cardBox = document.createElement("div");
        const dayCard = document.createElement("div");
        const cardContent = document.createElement("div");
        const day = document.createElement("span");
        const dayIconEl = document.createElement("img");
        const dayTemp = document.createElement("p");
        const dayWind = document.createElement("p");
        const dayHumidity = document.createElement("p");
        // Gotta have those Materialize UI classes
        cardBox.className = "col s12 m6 l3 xl2"
        dayCard.className = "card light-blue lighten-2";
        cardContent.className = "card-content white-text";
        day.className = "card-title";
        dayIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`);
        dayIconEl.className = "weather-icon";
        const theDate = new Date(weatherData.daily[i].dt * 1000);
        // Some wise guy who invented JS thought it was real smart to count months starting from 0. Why I oughta...
        day.textContent = (theDate.getMonth() + 1) + "/" + theDate.getDate() + "/" + theDate.getFullYear();

        dayTemp.textContent = `Temp: ${weatherData.daily[i].temp.day} °C`;
        const dayWindKM = (weatherData.daily[i].wind_speed * 3.6).toFixed(1);
        dayWind.textContent = `Wind: ${dayWindKM} km/h`;
        dayHumidity.textContent = `Humidity: ${weatherData.daily[i].humidity} %`;
        // Put it all on the card, in Materialize format...
        cardContent.appendChild(day);
        cardContent.appendChild(dayIconEl);
        cardContent.appendChild(dayTemp);
        cardContent.appendChild(dayWind);
        cardContent.appendChild(dayHumidity);
        // And roll it all up onto the big cheese element
        dayCard.appendChild(cardContent);
        cardBox.appendChild(dayCard);
        fiveDayForecastEl.appendChild(cardBox);
    }

    weatherContainerEl.appendChild(fiveDayForecastEl);
};
// The button handler. If it's the serach button, you feed what's in the search bar to the function. If not, you feed the ID of the button you clicked. Foolproof! As long as no one adds more buttons that do other things to the page, anyway...
const searchButtonHandler = event => {
    const clickedEl = event.target;
    if (clickedEl.localName === "button") {
        if (clickedEl.id === "searchButton") {
            const searchTerm = searchInputEl.value;
            getWeatherData(searchTerm);
        } else {
            const searchTerm = clickedEl.id;
            getWeatherData(searchTerm);
        }
    }
};
// The handler for the button, delegated to the container to save time
searchContainerEl.addEventListener("click", searchButtonHandler);
