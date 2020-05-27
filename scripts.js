let cityslot = document.getElementById("city");
let tempslot = document.getElementById("temp");
let precipslot = document.getElementById("precip");
let humidityslot = document.getElementById("humidity");
let summaryslot = document.getElementById("summary");
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
    fetch('https://ipinfo.io/?token=396826dfb86b94')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log("ipinfo data: ", data);
        let loc = data.loc;
        let city = data.city;
        let region = data.region;

        cityslot.innerHTML += `${city}, ${region}`;

        let proxyUrl = 'https://cors-anywhere.herokuapp.com/', targetUrl = `https://api.darksky.net/forecast/0e17dfdfdee5ff8839c6ffead1cf1b74/${loc}?exclude=minutely,hourly,flags,alerts&units=auto`;
        fetch(proxyUrl + targetUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("dark sky data: ", data);
            let temp = ` ${data.currently.temperature}&deg`;
            let feelsLike = `but feels like ${data.currently.apparentTemperature}&deg`;
            let summary = ` ${data.currently.summary}`;

            tempslot.innerHTML += `${temp}, ${feelsLike}`;
            summaryslot.innerHTML += `${summary}`;
        });
    });
}

getLocation();