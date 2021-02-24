'use-strict';

let moonDescription = document.querySelector('.moonDescription');
let moonText = document.querySelector('.moonText');
let moonIllumination = document.querySelector('.moonIllumination');
let moonIcon = document.querySelector('.moonIcon');
let locationContainer = document.querySelector('.location');
let locationText = document.querySelector('.locationText');
let locationTimezone = document.querySelector('.locationTimezone');

let latitude, longitude;

//Geolocation API
const getPosition = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, err => {
            alert(`${err.message}: Please enable location services for your browser`);
        });
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
        if (!responseGeo.ok) throw new Error('Could not retrieve location. Reloading page now...');

        const dataGeo = await responseGeo.json();

        let city = dataGeo.city.toLowerCase();
        locationContainer.classList.remove('hidden');
        locationText.textContent = `Your Current Location:`;
        locationTimezone.textContent = `${city[0].toUpperCase() + city.substring(1)}, ${
            dataGeo.statename
        }`;
    } catch (err) {
        console.error(err);
        alert(err);
        location.reload();
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
        if (!responseMoon.ok)
            throw new Error('Could not retrieve current moon phase. Sever experiencing issues');

        const dataMoon = await responseMoon.json();

        let moonPhase = String(dataMoon.astronomy.astro.moon_phase);
        let moonPhaseJoined = moonPhase.replace(' ', '_');

        moonDescription.classList.remove('hidden');
        moonText.textContent = moonPhase;
        moonIllumination.textContent = `${dataMoon.astronomy.astro.moon_illumination}% Illumination`;

        moonIcon.insertAdjacentHTML(
            'beforeend',
            `<img src="img/${moonPhaseJoined}.png" alt="${moonPhase} Created by MarkieAnn Packer from Noun Project">`
        );
    } catch (err) {
        console.error(err);
        alert(err);
        location.reload();
    }
};

getMoonPhase();
displayPosition();
