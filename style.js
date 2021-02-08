'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
let count = 0

///////////////////////////////////////
const renderCountry = function (data, className = '') {,

  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // btn.classList.add('hidden')
  countriesContainer.style.opacity = 1;


};
// const request = fetch('https://restcountries.eu/rest/v2/name/India')

const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      renderError(err)
    });
};
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const whereIam = async function (country) {
  const pos = await getPosition()
  // console.log(pos);
  const { latitude:lat , longitude:lng}=pos.coords
  const geoLoc = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  console.log(geoLoc);
  const data1  = await geoLoc.json()
  console.log(data1);
  const res = await fetch(`https://restcountries.eu/rest/v2/name/${data1.country}`);
  const data = await res.json();
  renderCountry(data[0]);
};
btn.addEventListener('click', function () {
  if(count===0){
    whereIam()
  }
  count++
  console.log(count);
  
});