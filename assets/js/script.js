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

        // First we call the weather API, because that one accepts a city name. We do this to find the latitude and longitude to feed to the one call API
        fetch(firstapiUrl + searchTerm + apiKey)
            .then(response => {
                // If this response is legit
                if (response) {
                    response.json().then(data => {
                        // Now the REAL call, using the obtained lat and lon
                        const cityName = data.name;
                        fetch(oneCallapiUrl + "lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=metric" + apiKey)
                            .then(secResponse => {
                                // If this REAL response is legit
                                if (secResponse) {
                                    // THEN we use this to display the weather
                                    secResponse.json().then(secData => {
                                        displayWeather(secData, cityName);
                                    })
                                }
                            })
                        
                        // displayWeather(data);
                    })
                }
            });
    }
};

const displayWeather = (weatherData, cityName) => {
    // First, make the boxes that contain all the things
    const cityBoxEl = document.createElement("div");
    const cityNameEl = document.createElement("h2");
    const cityTempEl = document.createElement("p");
    const cityWindEl = document.createElement("p");
    const cityHumidityEl = document.createElement("p");
    const cityUVEl = document.createElement("p");
    // Then, give them all their requisite properties, including the text containing the data for the weather for the location searched

    cityBoxEl.className = "row s12";
    cityBoxEl.id = "cityBox"

    cityNameEl.textContent = cityName;
    cityTempEl.textContent = "Temp: " + weatherData.current.temp  + " °C";
    cityWindEl.textContent = "Wind: " + weatherData.current.wind_speed + " m/s";
    cityHumidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %";
    cityUVEl.textContent = "UV Index: " + weatherData.current.uvi;

    // Then apply it to the page

    cityBoxEl.appendChild(cityNameEl);
    cityBoxEl.appendChild(cityTempEl);
    cityBoxEl.appendChild(cityWindEl);
    cityBoxEl.appendChild(cityHumidityEl);
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

    // Now to make each card for the next five days' forecasts
    for (let i = 0; i < 5; i++) {
        const cardBox = document.createElement("div");
        const dayCard = document.createElement("div");
        const cardContent = document.createElement("div");
        const day = document.createElement("span");
        const dayTemp = document.createElement("p");
        const dayWind = document.createElement("p");
        const dayHumidity = document.createElement("p");
        // Gotta have those Materialize UI classes
        cardBox.className = "col m12 l2"
        dayCard.className = "card light-blue darken-1";
        cardContent.className = "card-content white-text";
        day.className = "card-title";

        const theDate = new Date(weatherData.daily[i].dt * 1000);
        // Some wise guy who invented JS thought it was real smart to count months starting from 0. Why I oughta...
        day.textContent = (theDate.getMonth() + 1) + "/" + theDate.getDate() + "/" + theDate.getFullYear();

        dayTemp.textContent = weatherData.daily[i].temp.day + " °C";
        dayWind.textContent = weatherData.daily[i].wind_speed + " m/s"
        dayHumidity.textContent = weatherData.daily[i].humidity + " %";
        // Put it all on the card, in Materialize format...
        cardContent.appendChild(day);
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

const searchButtonHandler = event => {
    const targ = event.target;
    const searchTerm = searchInputEl.value;
    // If the search button is hit, clear the current weather and get new data
    if (targ.id === "searchButton") {
        getWeatherData(searchTerm);
    }
};

searchContainerEl.addEventListener("click", searchButtonHandler);