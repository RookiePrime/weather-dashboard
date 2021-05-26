const searchContainerEl = document.querySelector("#searchContainer");
const searchInputEl = document.querySelector("input[type=search]");
const apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=43.6685281&lon=79.3941777&appid=";
const apiKey = "b9b5e05331dc05e13390961cd01eb4f8";

const getWeatherData = searchTerm => {
    // If the search term isn't nothing
    if (searchTerm) {
        fetch(apiUrl + apiKey)
            .then(response => {
                console.log(response);
                if (response) {
                    response.json().then(data => {
                        console.log(data);
                    })
                }
            });
    }
};

const searchButtonHandler = event => {
    const targ = event.target;
    const searchTerm = searchInputEl.value;

    if (targ.id === "searchButton") {
        getWeatherData(searchTerm);
    }
}

searchContainerEl.addEventListener("click", searchButtonHandler);