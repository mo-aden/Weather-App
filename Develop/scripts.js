const apiKey = "06e20dcd9d8864feaf509bbb85437340";

const searchBtn = document.querySelector("#searchBtn");

const userInput = document.querySelector(".inputField");

let cities = [];

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const userValue = userInput.value;
  cities.push(userValue);

  localStorage.setItem("userinput", JSON.stringify(cities));
  fetchCityCoordinates(userValue);
  //   console.log(userValue);
});

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

function fetchCurrentWeather(lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
