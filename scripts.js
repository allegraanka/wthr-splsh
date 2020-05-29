let timeslot = document.getElementById("time");
let dateslot = document.getElementById("date");

dateslot.innerHTML = moment().format("ddd, MMM Do");
document.onload = window.setInterval(getTime, 1000);

function getTime() {
    let d = new Date();
    let t = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    timeslot.innerHTML = t;
}

function getLocation() {
    return fetch('https://ipinfo.io/?token=396826dfb86b94')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        const locationDetails = {
            loc: data.loc,
            city: data.city,
            region: data.region
        }
        return locationDetails;
    })
    .catch((error) => {
        console.log("there was an error: ", error);
    });
};

// getLocation().then((locationDetails) => {console.log("loc locationDetails: ", locationDetails)});

async function getWeather() {
    let currentCoordinates = await getLocation().then((locationDetails) => {return locationDetails.loc});
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    let targetUrl = `https://api.darksky.net/forecast/0e17dfdfdee5ff8839c6ffead1cf1b74/${currentCoordinates}?exclude=minutely,hourly,flags,alerts&units=auto`;

    return fetch(proxyUrl+targetUrl)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        const weatherDetails = {
            temp: data.currently.temperature,
            feelsLike: data.currently.apparentTemperature,
            summary: data.currently.summary
        };
        return weatherDetails;
    })
    .catch((error) => {
        console.log("there was an error: ", error);
    });
}

// set the city on the city field
let cityslot = document.getElementById("city");

// set the temperature on the temperature field
let temperatureField = document.getElementById("temp");
let feelsLikeField = document.getElementById("feelsLike");
let summaryField = document.getElementById("summary");

async function setWeather() {
    var temperature = await getWeather().then(weatherDetails => weatherDetails.temp);
    var feelsLike = await getWeather().then(weatherDetails => weatherDetails.feelsLike);
    var summary = await getWeather().then(weatherDetails => weatherDetails.summary);
    
    temperatureField.innerHTML += `Temperature: ${temperature}&degF`;
    feelsLikeField.innerHTML += `Feels like: ${feelsLike}&degF`;
    summaryField.innerHTML += `Outside Currently: ${summary}`;
}

setWeather();

async function getPhoto() {
    var query = await getWeather().then(weatherDetails => weatherDetails.summary);
    var client_id = 'vcy9-edsyORibDbHn8niyPoKb5N2JXatDpvs_A0XYME';
    var baseUrl = 'https://api.unsplash.com';
    var endpoint = '/photos/random';

    return fetch(`${baseUrl}${endpoint}?client_id=${client_id}&query=${query}`)
    .then(response => response.json())
    .then((data) => {
        const photoDetails = {
            photographer: {
                name: data.user.name,
                from: data.user.location,
                bio: data.user.bio
            },
            photo: {
                photoUrl: data.urls.full,
                takenWith: data.exif.model
            }
        }
        return photoDetails;
    })
    .catch(error => console.log(`There was an error fetching photo: ${error}`));
}

getPhoto().then(photoDetails => console.log("photo taken with: ", photoDetails.photo.takenWith));