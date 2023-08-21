var recentSearches = JSON.parse(localStorage.getItem('searches')) || [];
console.log(recentSearches);

var searchHistory = document.getElementById('recently_viewed');
getWeather('Chicago');

function getWeather(city) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' +
        city +
        '&appid=6362005dd0658b2343931c05bca41801&units=imperial';

    fetch(url)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log(data);
            localStorage.setItem('city', JSON.stringify(data));
            console.log(data);

            var currentCity = document.getElementById('current_city');
            currentCity.textContent = city;
            setCurrentWeather(data.list[0]);
            setForecast(data.list);
        });
}

function setCurrentWeather(weather) {
    var forecastDate = weather.dt;
    console.log(forecastDate);

    var convertTimeMilli = forecastDate * 1000;
    var dateTime = new Date(convertTimeMilli);
    var newDate = dateTime.toLocaleDateString('en-US', { dateStyle: 'short' });
    var currentDate = document.getElementById('current_date');
    currentDate.innerHTML = newDate;

    var iconParagraphId = weather.weather[0].icon;
    var iconLink =
        'https://openweathermap.org/img/wn/' + iconParagraphId + '.png';
    var iconHTML = '<img src="' + iconLink + '">';
    var currentIcon = document.getElementById('current_icon');
    currentIcon.innerHTML = iconHTML;
    var currentTemperature = document.getElementById('current_temperature');
    currentTemperature.textContent =
        'Temperature: ' + weather.main.temp + ' \xB0F';

    var currentWind = document.getElementById('current_wind');
    currentWind.textContent = 'Wind: ' + weather.wind.speed + ' MPH';
    var currentHumidity = document.getElementById('current_humidity');
    currentHumidity.textContent = 'Humidity: ' + weather.main.humidity + ' %';
}

function setForecast(forecast) {
    for (var i = 0; i < forecast.length; i += 8) {
        console.log(forecast[i]);
        setForecastDay(forecast[i], i / 8 + 1);
    }
}

function setForecastDay(weather, dayNumber) {
    var iconParagraph = document.createElement("p");
    var iconParagraphId = weather.weather[0].icon;
    var iconLink = 'https://openweathermap.org/img/wn/' + iconParagraphId + '.png';
    var iconHTML = '<img src ="' + iconLink + '">';
    var forecastParagraph = document.createElement('p');
    var forecastDate = weather.dt;
    var convertTimeMilli = forecastDate * 1000;
    var dateTime = new Date(convertTimeMilli);
    var newDate = dateTime.toLocaleDateString('en-US', { dateStyle: 'short' });
    var day = document.getElementById('day-' + dayNumber);
    var dayList = [];

    var titleParagraph = document.createElement('p');
    titleParagraph.innerHTML = newDate + iconHTML;
    dayList.push(titleParagraph);

    var tempParagraph = document.createElement('p');
    tempParagraph.textContent = 'Temp: ' + weather.main.temp + ' \xB0F';
    dayList.push(tempParagraph);
    day.replaceChildren(...dayList);

    var windParagraph = document.createElement('p');
    windParagraph.textContent = 'Wind: ' + weather.wind.speed + ' MPH';
    dayList.push(windParagraph);
    day.replaceChildren(...dayList);
}

var searchForm = document.getElementById('search_form');
var city = document.getElementById('city');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var searchCity = city.value.trim();
    executeSearch(searchCity);
    addRecentSearch(searchCity);
});

function addRecentSearch(city) {
    var recentButton = document.createElement('button');
    recentButton.textContent = city;
    recentButton.addEventListener('click', function () {
        executeSearch(city);
    });

    searchHistory.appendChild(recentButton);
}

function executeSearch(searchCity) {
    recentSearches.push(searchCity);
    localStorage.setItem('searches', JSON.stringify(recentSearches));
    getWeather(searchCity);
}
