// CLOCK WIDGET
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Format the time string with leading zeros if needed
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Combine the time string
    var timeString = hours + ':' + minutes + ':' + seconds;

    // Update the clock element with the time string
    var clockDiv = document.getElementById('clock');
    if (clockDiv) {
        clockDiv.textContent = timeString;
    }
}

// Call `updateClock` every second to keep the time updated
setInterval(updateClock, 1000);


//WEATHER WIDGET
// Function to get the user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, showError);
    } else {
        document.getElementById('weather-info').textContent = "Geolocation is not supported by this browser.";
    }
}

// Function to handle the geolocation success response
function getWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const access_key = '2eb789817b66ccb468a7629e741b3d82'; // Replace with your actual API access key
    const query = `${latitude},${longitude}`;
    const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${query}&units=f`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            const weatherHtml = `
        <h2>${data.location.name}</h2>
        <p>${data.current.temperature}°F</p>
        <p>${data.current.weather_descriptions.join(', ')}</p>
        `
        ;
            document.getElementById('weather-info').innerHTML = weatherHtml;
        })
        .catch(error => {
            document.getElementById('weather-info').textContent = "Error fetching weather data: " + error.message;
            console.log("Error fetching weather data: " + error.message);
        });
}

// Function to handle the geolocation error response
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weather-info').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weather-info').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('weather-info').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weather-info').textContent = "An unknown error occurred.";
            break;
    }
}




// THIS DAY IN HISTORY WIDGET
// Function to get historical events for the current day
function getThisDayInHistory() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS, need to add 1
    const day = String(today.getDate()).padStart(2, '0');
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const events = data.selected; // Assuming we want the 'selected' array of events
            let historyHtml = '<h2>This Day in History</h2>';
            events.forEach(event => {
                historyHtml += `<p>${event.year}: ${event.text}</p>`;
            });
            document.getElementById('history-fact').innerHTML = historyHtml;
        })
        .catch(error => {
            document.getElementById('history-fact').textContent = "Error fetching historical data: " + error.message;
        });
}

// Call getThisDayInHistory on script load or after DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    getThisDayInHistory();
    getLocation();
});


