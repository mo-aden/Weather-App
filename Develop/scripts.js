const searchBtnEl = document.querySelector("#searchBtn");
const userInputEl = document.querySelector(".inputField");
const searchTextEl = document.querySelector(".searchText");
const searchedCitiesEl = document.querySelector(".searchedCities");
const cityNameEl = document.querySelector("#city-name");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");

//Get userInputs from local storage
const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
const apiKey = "06e20dcd9d8864feaf509bbb85437340";

//Get the lattitude and longitude of cities
function fetchCurrentWeather(lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Display data onto the page
      // console.log(data);
      displayWeatherInfo(data);
    });
}

//Using the user input get the weather data from the api

function fetchCityCoordinates(city) {
  const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apiKey}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data[0].lat);
      //   console.log(data[0].lon);
      fetchCurrentWeather(data[0].lat, data[0].lon);
    });
}

//Handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  const userInput = userInputEl.value;
  searchedCities.push(userInput); //pushes to the arr

  //store userinput in the local storage
  localStorage.setItem("cities", JSON.stringify(searchedCities));
  // localStorage.setItem("userInputs", JSON.stringify(cities));

  fetchCityCoordinates(userInput);

  //   console.log(userValue);
}

//event fun for submit
searchBtnEl.addEventListener("click", handleFormSubmit);

//Display searched Cities only last 5
function DisplaySearchedCities() {
  const recentCities = searchedCities.slice(-5, searchedCities.length);
  // console.log(recentCities);

  //Looping backwords to show the user recent searches
  for (let i = recentCities.length - 1; i >= 0; i--) {
    const city = recentCities[i];
    // console.log(city);

    //Create HTML element for each city
    const searchedCityBtnEl = document.createElement("button");
    searchedCityBtnEl.setAttribute("class", "city-searched");
    searchedCityBtnEl.textContent = city;

    //append it to the page
    searchedCitiesEl.append(searchedCityBtnEl);
  }
}

DisplaySearchedCities();

//Event for searched City Button click
function handleSearchedcityClick(e) {
  e.preventDefault();
  console.log(e.target.textContent);

  const cityInput = e.target.textContent;
  //call the api for new city input from the button
  fetchCityCoordinates(cityInput);
}

searchedCitiesEl.addEventListener("click", handleSearchedcityClick);

function displayWeatherInfo(data) {
  console.log(data);

  const timeNow = new Date(data.dt * 1000).toLocaleString();

  // console.log(timeNow);
  // const now = new Date(data.dt * 1000);
  // console.log(now.toLocaleString());
  cityNameEl.textContent = `${data.name} - ${timeNow}`;

  tempEl.textContent = `Temperature: ${data.main.temp}`;
  windEl.textContent = `Wind: ${data.wind.deg} degrees`;
  humidityEl.textContent = `Humidity: ${data.main.humidity}`;
}
