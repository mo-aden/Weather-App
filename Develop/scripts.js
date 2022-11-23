const searchBtnEl = document.querySelector("#searchBtn");
const userInputEl = document.querySelector(".inputField");
const searchTextEl = document.querySelector(".searchText");
const searchedCitiesEl = document.querySelector(".searchedCities");
const clearBtnEl = document.querySelector("#clearBtn");
const randomCardsEl = document.querySelector(".random-cards");
const searchHeadingEl = document.querySelector(".search-heading");

//Get userInputs from local storage
const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
const apiKey = "06e20dcd9d8864feaf509bbb85437340";

//Using the user input get the weather data from the api
function fetchCityCoordinates(city) {
  const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apiKey}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Call forcast fn and set its property for lat & lon
      fetchForcast(data[0].lat, data[0].lon);

      searchedCities.push(city); //pushes to the arr

      //store userinput in the local storage
      localStorage.setItem("cities", JSON.stringify(searchedCities));

      //call this fn to show the new entries
      DisplaySearchedCities();
    })
    .catch((err) => {
      //add class and change txt content
      searchHeadingEl.classList.add("alert");
      searchHeadingEl.textContent = `City Doesn't exist 🟥!`;

      setTimeout(() => {
        //Refresh the page
        window.location.reload();
      }, 1000);
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
      //using this data display random cards to the user
      displayRandomCards(data);
    });
}

//Handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  const userInput = userInputEl.value;

  //remove exisitng content on cards
  randomCardsEl.textContent = "";
  //call the fn to use the user input
  fetchCityCoordinates(userInput);
}

//event click fun for submit
searchBtnEl.addEventListener("click", handleFormSubmit);

//Display searched Cities only last 5
function DisplaySearchedCities() {
  //Only show the user the last 5 cities
  const recentCities = searchedCities.slice(-5, searchedCities.length);

  //Clear exisitng txt
  searchedCitiesEl.textContent = "";
  //Looping backwords to show the user most recent searches
  for (let i = recentCities.length - 1; i >= 0; i--) {
    const city = recentCities[i];

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
  // console.log(e.target.textContent);

  //Remove exisitng content on cards
  randomCardsEl.textContent = "";

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

function displayRandomCards(data) {
  //Data not changing
  const cityName = data.city.name;
  const country = data.city.country;

  //changing data
  const dataArr = data.list;

  for (let i = 1; i < dataArr.length; i += 8) {
    const item = dataArr[i];

    const dateNow = new Date(item.dt_txt).toLocaleDateString("en-us", { weekday: "long", year: "numeric", month: "numeric", day: "numeric" });

    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0]["icon"]}.png`;

    //Create a div container
    const div = document.createElement("div");
    div.setAttribute("class", "card");

    //add inner HTML to the div
    div.innerHTML = `   
          <div class="card-body">
            <p id="city-name">${cityName} - ${country}</p>
            <p id="date">${dateNow}</p>
            <img id="icon" src=${iconUrl} alt="weather Icon" />
            <p id="temp">${item.main.temp} ${"\u00B0F"}</p>
            <p id="description">Highs ${item.main.temp_max} & Lows ${item.main.temp_min}</p>
            <p id="wind">Wind: ${item.wind.speed} MPH</p>
            <p id="humidity">Humidity: ${item.main.humidity} %</p>
          </div>
        `;

    //append the div to the parent div
    randomCardsEl.append(div);
  }
}
