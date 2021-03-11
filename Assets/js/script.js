// 06 - Server Side API's: Weather App Homework
// Sam Gates: 03-10-21

// clear_btn 
// search_btn
// function for list item click (see quiz HW)

$('#search_btn').on('click', function(e) {
    console.log("YAY");
    e.preventDefault();
    
    // add some kind of input validation later
    //showResults($('#city').val());
});


showResults('Raleigh');

function showResults(city) {
    var cityLat = '';
    var cityLong = '';
    var cityName = city;

    // API key for sam.j.gates@gmail.com
    var apiKey = '2d1455849cad8d73b4d9605338104f0f';

    getCoordinatesUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    // use promise chain to 1. get coordinates using geo decode API, THEN 2. get all weather data needed for project from one call API 
    fetch(getCoordinatesUrl, {mode: 'cors'})
        .then(function (response) {
        // Check the console first to see the response.status
        console.log(response.status);
        if(response.status === 404) {
        //error response!
        }
        return response.json();
        })    
        // use coordinates to make a second API call to get all weather data
        .then(function (data) {
           cityLat = data[0].lat;
           cityLong = data[0].lon;

           forecastRequest = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLong + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;
        
           return fetch(forecastRequest, {mode: 'cors'});
        })
        .then(function(response) {
            if(response.status === 404) {
                //error response!
            }
            return response.json();
        })
        .then(function(data) {
            displayToday(data,cityName);
            displayForecast(data,cityName);
        });
}

// display today's current weather for location
function displayToday(data,city) {
    console.log(data);

    // find data points for the following
    var temperature = data.current.temp;
    var humidity = data.current.humidity;
    var wind = data.current.wind_speed;

    var UV = data.current.uvi;

    var weatherIconUrl = 'http://openweathermap.org/img/wn/' +  data.current.weather[0].icon + '.png';

    // still have to apply icon for weather, see if UV good or bad

    // display date/time
    var time = moment().format('MM/DD/YY');

    // display city name at top of content section
    $('#city_name').html(city + " on " + time + " <img src=" + weatherIconUrl + ">");

    $('#city_content').html('<ul>' +
    '<li>Temperature: ' + temperature + ' degrees</li>' +
    '<li>Humidity: ' + humidity + '%</li>' +
    '<li>Wind speed: ' + wind + ' MPH</li>' +
    '<li>UV Index: <span style=\'background-color: red; padding: 5px;\'>' + UV + '</span></li>' +
    '</ul>');
}

// display 5 day forecast for weather at location
function displayForecast(data) {
    console.log(data);
}

// stores past searches in localstorage
function addPastSearch() {

}

// retrives past searches, uses displayData to write to page
function retrievePastSearches() {

}

// clears search history
function clearPastSearches() {
    
}

