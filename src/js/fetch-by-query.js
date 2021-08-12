import Notiflix from 'notiflix';
import vars from './variables';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';
import { fethByOneCard } from './fetch-by-one-card';
import { pagination } from './pagination';
import noPosterImg from '../images/poster/no-poster.jpg';

const URL = '/search/movie';
const movieApiService = new MovieApiService(URL);

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('#cards-container'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
};

Notiflix.Loading.init({
  svgColor: `${vars.accentColor}`,
  svgSize: '120px',
});

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  refs.cardsContainer.innerHTML = '';
  refs.paginationContainer.dataset.fetchtype = URL;

  movieApiService.query = e.currentTarget.elements.searchQuery.value;
  movieApiService.page = 1;

  await fetchQuery(movieApiService);
  pagination.reset(movieApiService.totalResults);
}

export async function fetchQuery(movieApiService) {
  try {
    showLoading();

    const fetchedMovies = await movieApiService.fetchFilms();
    movieApiService.totalResults = fetchedMovies.total_results;
    hideLoading();

    checkPoster(fetchedMovies);

    const markup = makeMarkup(fetchedMovies);

    renderCards(markup);

    addListenersToCards('.card__item');

    localStorage.setItem('currentfilms', JSON.stringify(fetchedMovies));
  } catch (error) {
    console.log(error);
    hideLoading();
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
  fetchedMovies.results.forEach(el => {
    if (!el.title) {
      el.title = el.name;
    }

    el.year = el.release_date ? el.release_date.split('-')[0] : new Date().getFullYear();
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

export function showLoading() {
  Notiflix.Loading.arrows('Loading...');
}

export function hideLoading() {
  Notiflix.Loading.remove('Loading...');
}

export function makeNotificationError(text) {
  Notiflix.Notify.failure(text.toUpperCase());
}
