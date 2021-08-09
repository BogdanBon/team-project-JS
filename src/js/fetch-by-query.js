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

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  refs.cardsContainer.innerHTML = '';

  movieApiService.query = e.currentTarget.elements.searchQuery.value;
  movieApiService.query = 'tiger';
  fetchQuery();
}

async function fetchQuery() {
  try {
    const fetchedMovies = await movieApiService.fetchFilms();

    checkPoster(fetchedMovies);

    const markup = makeMarkup(fetchedMovies);

    renderCards(markup);

    addListenersToCards('.card__list > li');
  } catch (error) {
    console.log(error);
  }
}

// У фільми де немає постера - добавляє заготовку
function checkPoster(fetchedMovies) {
  fetchedMovies.results.forEach(e => {
    e.poster_path = e.poster_path ? `https://image.tmdb.org/t/p/w500${e.poster_path}` : noPosterImg;
  });
}

//Добавляет слушателей на все <li>
function addListenersToCards(selector) {
  const cards = document.querySelectorAll(selector);
  cards.forEach(el => {
    el.addEventListener('click', fethByOneCard);
  });
}

// Розмітка всіх карточок
function makeMarkup(fetchedMovies) {
  fetchedMovies.results.map(el => {
    el.year = el.release_date.split('-')[0];
    el.genre_names = createGenresMarkup(el.genre_ids);
  });

  return cardsTpl(fetchedMovies.results);
}

// Рендер всіх карточок
function renderCards(markup) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', markup);
}

// Пошук жанру по id
export function findGenrNameById(id) {
  const genr = genres.find(el => el.id === id);
  return genr.name;
}

// Розмітка жанрів: якщо жанрів 1-3, то повертає їх всі, а якщо жанрів 4-..., то повертає лише два і "others"
function createGenresMarkup(genresIdArr) {
  const genresNameArr = genresIdArr.map(el => findGenrNameById(el));

  if (genresIdArr.length > 3) {
    const newGenresArr = genresNameArr.slice(0, 2);
    newGenresArr.push('Others');
    return newGenresArr.join(', ');
  } else {
    return genresNameArr.join(', ');
  }
}
