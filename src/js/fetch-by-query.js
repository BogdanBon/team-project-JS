import Notiflix from 'notiflix';
import vars from './variables';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';
import { fethByOneCard } from './fetch-by-one-card';
import noPosterImg from '../images/poster/no-poster.jpg';

const URL = '/search/movie';
const movieApiService = new MovieApiService(URL);

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('#cards-container'),
};

Notiflix.Loading.init({
  svgColor: `${vars.accentColor}`,
});

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  refs.cardsContainer.innerHTML = '';

  movieApiService.query = e.currentTarget.elements.searchQuery.value;
  fetchQuery(movieApiService);
}

export async function fetchQuery(movieApiService) {
  try {
    showLoading();

    const fetchedMovies = await movieApiService.fetchFilms();

    hideLoading();

    checkPoster(fetchedMovies);

    const markup = makeMarkup(fetchedMovies);

    renderCards(markup);

    addListenersToCards('.card__item');
  } catch (error) {
    console.log(error);
  }
}

// У фільми де немає постера - добавляє заготовку
export function checkPoster(fetchedMovies) {
  fetchedMovies.results.forEach(e => {
    e.poster_path = e.poster_path ? `https://image.tmdb.org/t/p/w500${e.poster_path}` : noPosterImg;
  });
}

//Добавляет слушателей на все <li>
export function addListenersToCards(selector) {
  const cards = document.querySelectorAll(selector);
  cards.forEach(el => {
    el.addEventListener('click', fethByOneCard);
  });
}

// Розмітка всіх карточок
export function makeMarkup(fetchedMovies) {
  const currentDate = new Date();

  fetchedMovies.results.map(el => {
    console.log(el.title);
    if (!el.title) {
      el.title = el.name;
    }

    el.year = el.release_date ? el.release_date.split('-')[0] : currentDate.getFullYear();
    el.genre_names = createGenresMarkup(el.genre_ids);
  });

  return cardsTpl(fetchedMovies.results);
}

// Рендер всіх карточок
export function renderCards(markup) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', markup);
}

// Пошук жанру по id
export function findGenrNameById(id) {
  const genr = genres.find(el => el.id === id);
  if (!genr) {
    return;
  }
  return genr.name;
}

// Розмітка жанрів: якщо жанрів 1-3, то повертає їх всі, а якщо жанрів 4-..., то повертає лише два і "Others", якщо немає жанрів, то повертає "Others"
// Повертає рядок з жанрами
export function createGenresMarkup(genresIdArr) {
  if (!genresIdArr) {
    return;
  }
  const genresNameArr = [];

  genresIdArr.forEach(i => {
    const name = findGenrNameById(i);
    if (name) {
      genresNameArr.push(name);
    }
  });

  if (genresIdArr.length > 3 || genresIdArr.length === 0) {
    const newGenresArr = genresNameArr.slice(0, 2);
    newGenresArr.push('Others');
    return newGenresArr.join(', ');
  } else {
    return genresNameArr.join(', ');
  }
}

function showLoading() {
  Notiflix.Loading.arrows('Loading...');
}

function hideLoading() {
  Notiflix.Loading.remove('Loading...');
}
