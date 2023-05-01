import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const newDefaults = {
  width: '240px',
};
Notify.init(newDefaults);
const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const body = document.querySelector('body');

searchBox.addEventListener('input', debounce(onInputSearch), DEBOUNCE_DELAY);

function onInputSearch(e) {
  e.preventDefault();

  const searchCountries = e.target.value;

  if (!searchCountries) {
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'hidden';
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchCountries)
    .then(result => {
      if (result.length > 10) {
        Notify.info('Забагато збігів, будь ласка, конкретезуйте свій запит');
        return;
      }
      renderedCountries(result);
    })
    .catch(error => {
      countriesList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notify.failure('Не вдалося знайти жодної країни за Вашим запитом');
    });
}

function renderedCountries(result) {
  const inputLetters = result.length;

  if (inputLetters === 1) {
    countriesList.innerHTML = '';
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    countryCardMarkup(result);
  }

  if (inputLetters > 1 && inputLetters <= 10) {
    countryInfo.innerHTML = '';
    countryInfo.style.visibility = 'hidden';
    countriesList.style.visibility = 'visible';
    countriesListMarkup(result);
  }
}

function countriesListMarkup(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return `<li>
                        <img src="${flags.svg}" alt="${name}" width="40" height="auto">
                        <span>${name.official}</span>
                </li>`;
    })
    .join('');
  countriesList.innerHTML = listMarkup;
  return listMarkup;
}

function countryCardMarkup(result) {
  const cardMarkup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `
            <img src="${flags.svg}" alt="${name}" width="220" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    })
    .join('');
  countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}
