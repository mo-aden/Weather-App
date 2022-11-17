const searchBtn = document.querySelector("#searchBtn");
const userInput = document.querySelector(".inputField");
const searchTextEl = document.querySelector(".searchText");

const apiKey = "06e20dcd9d8864feaf509bbb85437340";
let cities = [];

//event fun for submit
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const inputValue = userInput.value;
  cities.push(inputValue);

  localStorage.setItem("userInputs", JSON.stringify(cities));

  fetchCityCoordinates(inputValue);
  //   console.log(userValue);
});

//Display user input values
const inputValues = JSON.parse(localStorage.getItem("userInputs")) || [];

console.log(inputValues);

searchTextEl.innerHTML = inputValues
  .map((item) => {
    return `<li> ${item} <li>`;
  })
  .join("");

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
      console.log(data.main);
    });
}
