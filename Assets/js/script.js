// 06 - Server Side API's: Weather App Homework
// Sam Gates: 03-10-21

// clear_btn 
// search_btn
// function for list item click (see quiz HW)

$('#search_btn').on('click', function(e) {
    console.log("YAY");
    e.preventDefault();
    
    showResults($('#city').val());
});

displayStart();

// display initial start page
function displayStart() {
    $('#forecast_section').attr("style","display: none");
    $('#city_name').html("Welcome to the very exciting Weather App!");
    $('#city_content').html("Please use the search bar to the left to continue.");
}

// show data user requested (relies on functions below)
function showResults(city) {
    var cityLat = '';
    var cityLong = '';

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
        // finally, send weather data to page
        .then(function(data) { 
            displayToday(data,city); // display current weather info to page
            displayForecast(data,city); // display forecase to page
        });
}

// display today's current weather for location
function displayToday(data,city) {
    console.log(data);

    // find data points for the following
    var temperature = data.current.temp;
    var humidity = data.current.humidity;
    var wind = data.current.wind_speed;

    // change styling of UV based on scale
    var UV = data.current.uvi;
    var styledUV = ''; // string with styling for different codes

    if (UV < 3) {
        styledUV = '<span style=\'background-color: green; padding: 5px;\'>' + UV;
    }
    else if (UV > 3 && UV < 6) {
        styledUV = '<span style=\'background-color: yellow; padding: 5px;\'>' + UV;
    }
    else {
        styledUV = '<span style=\'background-color: red; padding: 5px;\'>' + UV;
    }

    var weatherIconUrl = 'http://openweathermap.org/img/wn/' +  data.current.weather[0].icon + '.png';

    var weatherAlt = data.current.weather[0].description;

    // still have to apply icon for weather, see if UV good or bad

    // display date/time
    var time = moment().format('MM/DD/YY');

    // display city name at top of content section, along with image 
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src",weatherIconUrl);
    imageEl.setAttribute("alt",weatherAlt);
    
    $('#city_name').html(city + " on " + time + " ");
    $('#city_name').append(imageEl);

    // display list of current conditions extracted from API data
    $('#city_content').html('<ul>' +
    '<li>Temperature: ' + temperature + ' degrees</li>' +
    '<li>Humidity: ' + humidity + '%</li>' +
    '<li>Wind speed: ' + wind + ' MPH</li>' +
    '<li>UV Index: ' + styledUV + '</span></li>' +
    '</ul>');
}

// display 5 day forecast for weather at location
function displayForecast(data) {
    // reset entire container so data doesn't build on itself
    $('#city_forecast').html('');
    $('#forecast_section').attr("style","display: all");

    // display 5 day forecast using API data
    for (i = 1; i <= 5; i++) { 
        // create containers, then add content below
        var cardContainer = document.createElement("div");
        cardContainer.setAttribute("class","card col-md-2 p-0 mx-2");

        var cardHeader = document.createElement("div");
        cardHeader.setAttribute("class","card-header p-1");

        // add date to header
        cardHeader.innerHTML = "<h5>" + getDate(data.daily[i].dt) + "</h5>";

        // create card body
        var cardBody = document.createElement("div");
        cardBody.setAttribute("class","card-body p-2");

        // build src link for image with alt descr
        var weatherIconUrl = 'http://openweathermap.org/img/wn/' +  data.daily[i].weather[0].icon + '.png'; 
        var weatherIconDescr = data.daily[0].weather[0].description;
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src",weatherIconUrl);
        weatherIcon.setAttribute("alt",weatherIcon);
        cardBody.append(weatherIcon);

        // create list for other attributes, add to cardBody
        var forecastList = document.createElement("ul");
        forecastList.innerHTML = 
            "<li>Temp: " + data.daily[i].temp.day + "&deg;F</li>" +
            "<li>Humidity: " + data.daily[i].humidity + "%</li>";
        cardBody.append(forecastList);

        // build card, add to page
        cardContainer.append(cardHeader);
        cardContainer.append(cardBody);
        $('#city_forecast').append(cardContainer);
    }
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

function getDate(timestamp) {
    return moment.unix(timestamp).format('MM/DD/YY');
}
