let timeslot = document.getElementById("time");
let dateslot = document.getElementById("date");

dateslot.innerHTML = moment().format("ddd, MMM Do");
document.onload = window.setInterval(getTime, 1000);

setWeather();

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
var cityslot = document.getElementById("city");

// set the temperature on the temperature field
var temperatureField = document.getElementById("temp");
var feelsLikeField = document.getElementById("feelsLike");
var summaryField = document.getElementById("summary");

async function setWeather() {
    let temperature = await getWeather().then(weatherDetails => weatherDetails.temp);
    let feelsLike = await getWeather().then(weatherDetails => weatherDetails.feelsLike);
    let summary = await getWeather().then(weatherDetails => weatherDetails.summary);
    
    temperatureField.innerHTML += `Temperature: ${temperature}&degF`;
    feelsLikeField.innerHTML += `Feels like: ${feelsLike}&degF`;
    summaryField.innerHTML += `Outside Currently: ${summary}`;
}

async function getPhoto() {
    let query = await getWeather().then(weatherDetails => weatherDetails.summary);
    let client_id = 'vcy9-edsyORibDbHn8niyPoKb5N2JXatDpvs_A0XYME';
    let baseUrl = 'https://api.unsplash.com';
    let endpoint = '/photos/random';

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

// getPhoto().then(photoDetails => console.log("photo taken with: ", photoDetails.photo.takenWith));

// set background photo with random photo from unsplash
var photographerNameField = document.getElementById("photographer_name");
var photographerFromField = document.getElementById("photographer_from");
var photographerBioField = document.getElementById("photographer_bio");
var photoTakenWithField = document.getElementById("photo_taken_with");

async function setPhoto() {
    let photographerName = await getPhoto().then(photoDetails => photoDetails.photographer.name);
    let photographerLoc = await getPhoto().then(photoDetails => photoDetails.photographer.from);
    let photographerBio = await getPhoto().then(photoDetails => photoDetails.photographer.bio);
    let photoUrl = await getPhoto().then(photoDetails => photoDetails.photo.photoUrl);
    let photoTakenWith = await getPhoto().then(photoDetails => photoDetails.photo.takenWith);

    photographerNameField.innerHTML += photographerName;
    photographerFromField.innerHTML += photographerLoc;
    photographerBioField.innerHTML += photographerBio;
    photoTakenWithField.innerHTML += photoTakenWith;

    let styling = `body { background: #1a1e24 no-repeat center url(${photoUrl}); background-blend-mode: overlay; color: white; }`;
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(styling));

    document.head.appendChild(style);
}

setPhoto();