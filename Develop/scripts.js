const searchBtnEl = document.querySelector("#searchBtn");
const userInputEl = document.querySelector(".inputField");
const searchTextEl = document.querySelector(".searchText");
const searchedCitiesEl = document.querySelector(".searchedCities");
const cityNameEl = document.querySelector("#city-name");
const dateEl = document.querySelector("#date");
const iconEl = document.querySelector("#icon");
const tempEl = document.querySelector("#temp");
const supscriptEl = document.querySelector("#temp sup");
const descriptionEL = document.querySelector("#description");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");
const clearBtnEl = document.querySelector("#clearBtn");

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
      // displayWeatherInfo(data);
    });
}

//Using the user input get the weather data from the api

function fetchCityCoordinates(city) {
  const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apiKey}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data[0].lat);
      //   console.log(data[0].lon);
      fetchCurrentWeather(data[0].lat, data[0].lon);
      fetchForcast(data[0].lat, data[0].lon);

      searchedCities.push(city); //pushes to the arr

      //store userinput in the local storage
      localStorage.setItem("cities", JSON.stringify(searchedCities));
      // localStorage.setItem("userInputs", JSON.stringify(cities));
      DisplaySearchedCities();
    })
    .catch((err) => {
      console.log(`Enter correct city ...`);
    });
}

//fetch the five days forcat
function fetchForcast(lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Display data onto the page
      // console.log(data);
      console.log(data);
      // displayWeatherInfo(data);
      displayToday(data);
      // displayWeatherInfo(data);
    });
}

//Handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  const userInput = userInputEl.value;
  // searchedCities.push(userInput); //pushes to the arr

  // //store userinput in the local storage
  // localStorage.setItem("cities", JSON.stringify(searchedCities));
  // // localStorage.setItem("userInputs", JSON.stringify(cities));
  // DisplaySearchedCities();

  fetchCityCoordinates(userInput);

  //   console.log(userValue);
}

//event fun for submit
searchBtnEl.addEventListener("click", handleFormSubmit);

//Display searched Cities only last 5
function DisplaySearchedCities() {
  const recentCities = searchedCities.slice(-5, searchedCities.length);
  // console.log(recentCities);

  //Clear
  searchedCitiesEl.textContent = "";
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

// DisplaySearchedCities();

//Event for searched City Button click
function handleSearchedcityClick(e) {
  e.preventDefault();
  console.log(e.target.textContent);

  const cityInput = e.target.textContent;
  //call the api for new city input from the button
  fetchCityCoordinates(cityInput);
}

searchedCitiesEl.addEventListener("click", handleSearchedcityClick);

//Clear search cities
clearBtnEl.addEventListener("click", function (e) {
  e.preventDefault();

  localStorage.clear();

  //Clear
  searchedCitiesEl.textContent = "";

  //Refresh the page
  window.location.reload();
});

// function displayWeatherInfo(data) {
//   console.log(data);

//   const timeNow = new Date(data.dt * 1000).toLocaleString();

//   // console.log(timeNow);
//   // const now = new Date(data.dt * 1000);
//   // console.log(now.toLocaleString());
//   cityNameEl.textContent = `${data.name} - ${timeNow}`;

//   tempEl.textContent = `Temperature: ${data.main.temp}`;
//   windEl.textContent = `Wind: ${data.wind.deg} degrees`;
//   humidityEl.textContent = `Humidity: ${data.main.humidity}`;
// }

//Randonly generated cards
function displayToday(data) {
  const cityName = data.city.name;
  console.log(cityName);
  const country = data.city.country;
  console.log(country);

  let dt = new Date(data.list[0].dt_txt);
  const today = dt.toLocaleDateString("en-us", { weekday: "long", year: "numeric", month: "numeric", day: "numeric" });
  console.log(today);

  // const icon = data.list.weather;

  const iconUrl = `https://openweathermap.org/img/wn/${data.list[0].weather[0]["icon"]}.png`;

  const cloudInfo = data.list[0].weather[0]["description"];

  // https://openweathermap.org/img/wn/${data.list[0].weather[0]["description"]};

  console.log(cloudInfo);

  const temp = data.list[0].main.temp;
  console.log(temp);

  const maxTemp = data.list[0].main.temp_max;
  const minTemp = data.list[0].main.temp_min;

  console.log(maxTemp, minTemp);

  const humidity = data.list[0].main.humidity;
  console.log(humidity);

  const wind = data.list[0].wind.speed;

  cityNameEl.textContent = `${cityName} - ${country}`;
  dateEl.textContent = today;
  iconEl.src = iconUrl;
  tempEl.textContent = `${temp} ${"\u00B0F"}`;
  descriptionEL.textContent = `Highs ${maxTemp} & Lows ${minTemp}`;
  windEl.textContent = `Wind Speed = ${wind} MPH`;
  humidityEl.textContent = `Humidity = ${humidity} %`;
}
