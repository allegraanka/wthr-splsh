let cityslot = document.getElementById("city");
let tempslot = document.getElementById("temp");
let precipslot = document.getElementById("precip");
let humidityslot = document.getElementById("humidity");
let summaryslot = document.getElementById("summary");
let timeslot = document.getElementById("time");
let dateslot = document.getElementById("date");

dateslot.innerHTML = moment().format("dddd, MMMM Do YYYY");
timeslot.innerHTML = moment().format("h:mm a");

function getLocation() {
    fetch('https://ipinfo.io/?token=396826dfb86b94')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log("ipinfo data: ", data);
        let loc = data.loc;
        let city = data.city;
        let region = data.region;

        cityslot.innerHTML = `${city}, ${region}`;

        let proxyUrl = 'https://cors-anywhere.herokuapp.com/', targetUrl = `https://api.darksky.net/forecast/0e17dfdfdee5ff8839c6ffead1cf1b74/${loc}?exclude=minutely,hourly,flags,alerts&units=auto`;
        fetch(proxyUrl + targetUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("dark sky data: ", data);
            let temp = `temperature: ${data.currently.temperature}`;
            let feelsLike = `feels like ${data.currently.apparentTemperature}`;
            let precipIntensity = `precipitation intensity: ${data.currently.precipIntensity}`;
            let humidity = `humidity: ${data.currently.humidity}`;
            let summary = `currently: ${data.currently.summary}`;

            tempslot.innerHTML = `${temp}, ${feelsLike}`;
            precipslot.innerHTML = precipIntensity;
            humidityslot.innerHTML = humidity;
            summaryslot.innerHTML = summary;
        });
    });
}

getLocation();