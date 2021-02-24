'use-strict';

let moonText = document.querySelector('.moonText');
let moonIllumination = document.querySelector('.moonIllumination');
let moonIcon = document.querySelector('.moonIcon');
let locationTimezone = document.querySelector('.locationTimezone');

let latitude, longitude;

//Geolocation API
const getPosition = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

//Display the user's current location
const displayPosition = async function () {
    try {
        const pos = await getPosition();
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        //Reverse geocoding API
        const responseGeo = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
        if (!responseGeo.ok) throw new Error('Could not retrieve city and state data');

        const dataGeo = await responseGeo.json();
        console.log(dataGeo);

        let city = dataGeo.city.toLowerCase();
        locationTimezone.textContent = `${city[0].toUpperCase() + city.substring(1)}, ${
            dataGeo.statename
        }`;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//Retrieve moon data and render it
const getMoonPhase = async function () {
    try {
        const pos = await getPosition();
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        //Weather API--Astronomy
        const responseMoon = await fetch(
            `https://api.weatherapi.com/v1/astronomy.json?key=61e062c61e5149e1a5b01136212302&q=${latitude},${longitude}`
        );
        if (!responseMoon.ok) throw new Error('Could not retrieve current moon phase');

        const dataMoon = await responseMoon.json();

        let moonPhase = String(dataMoon.astronomy.astro.moon_phase);
        let moonPhaseJoined = moonPhase.replace(' ', '_');

        moonText.textContent = moonPhase;
        moonIllumination.textContent = `${dataMoon.astronomy.astro.moon_illumination}% Illumination`;

        moonIcon.insertAdjacentHTML(
            'beforeend',
            `<img src="img/${moonPhaseJoined}.png" alt="${moonPhase} Created by MarkieAnn Packer from Noun Project">`
        );

        console.log(dataMoon);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

getMoonPhase();
displayPosition();
