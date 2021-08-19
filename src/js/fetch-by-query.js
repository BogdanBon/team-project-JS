import Notiflix from 'notiflix';
import vars from './variables';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';
import { fethByOneCard } from './fetch-by-one-card';
import { pagination } from './pagination';
import noPosterImg from '../images/poster/no-poster.jpg';
import { checkedGenresArr, filterMovies, checkImagesCount, observer } from './filter-by-genres';
const URL = '/search/movie';
const movieApiService = new MovieApiService(URL);

let filteredFetchedMovies = [];
let filteredFetchedMoviesCurrent = [];

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('#cards-container'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
  notification: document.querySelector('.notification'),
  sentinelContainer: document.querySelector('.sentinel__container'),
  sentinel: document.querySelector('.sentinel'),
  genreBtns: document.querySelectorAll('.genres__checkbox'),
  footer: document.querySelector('.footer'),
};

Notiflix.Loading.init({
  svgColor: `${vars.accentColor}`,
  svgSize: '120px',
});

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  refs.notification.classList.remove('is-visible');
  refs.sentinel.classList.add('visually-hidden');

  movieApiService.query = e.currentTarget.elements.searchQuery.value;

  movieApiService.url = '/search/movie';

  if (!movieApiService.query) {
    refs.notification.classList.add('is-visible');
    return;
  }

  observer.unobserve(sentinel);

  refs.paginationContainer.dataset.fetchtype = '/search/movie';

  movieApiService.page = 1;

  refs.cardsContainer.innerHTML = '';

  refs.genreBtns.forEach(e => {
    e.checked = false;
  });

  checkedGenresArr.splice(0, checkedGenresArr.length);

  await fetchQuery(movieApiService);

  pagination.reset(movieApiService.totalResults);

  if (refs.cardsContainer.scrollHeight < window.innerHeight - 320) {
    refs.footer.classList.add('fixed-footer');
  } else {
    refs.footer.classList.remove('fixed-footer');
  }
}

export async function fetchQuery(movieApiService) {
  try {
    showLoading();

    const fetchedMovies = await movieApiService.fetchFilms();

    movieApiService.totalResults = fetchedMovies.total_results;
    movieApiService.totalPages = fetchedMovies.total_pages;

    if (!movieApiService.totalResults) {
      refs.notification.classList.add('is-visible');
      refs.paginationContainer.classList.add('visually-hidden');
      hideLoading();
      return;
    }

    let markup = '';

    if (!checkedGenresArr.length) {
      refs.paginationContainer.classList.remove('visually-hidden');
      refs.paginationContainer.dataset.fetchtype = movieApiService.url;

      checkPoster(fetchedMovies.results);

      markup = makeMarkup(fetchedMovies.results);
    } else {
      let fetchedMovies1 = [];
      let fetchedMovies1Current = [];

      filteredFetchedMovies = [...filterMovies(fetchedMovies.results)];

      while (
        filteredFetchedMovies.length < 4 &&
        fetchedMovies.total_pages >= movieApiService.page
      ) {
        movieApiService.page += 1;
        if (movieApiService.page > 150) {
          hideLoading();
          sentinel.classList.remove('visually-hidden');
          return;
        }
        const films = await movieApiService.fetchFilms();

        fetchedMovies1Current = [...films.results];

        fetchedMovies1 = [...fetchedMovies1Current];

        filteredFetchedMoviesCurrent = [...filterMovies(fetchedMovies1)];

        filteredFetchedMovies.push(...filteredFetchedMoviesCurrent);
      }

      checkPoster(filteredFetchedMovies);

      markup = makeMarkup(filteredFetchedMovies);
    }

    hideLoading();

    renderCards(markup);

    checkImagesCount(movieApiService.totalPages, movieApiService.page);

    addListenersToCards('.card__item');
  } catch (error) {
    console.log(error);

    hideLoading();
  }
}

// У фільми де немає постера - добавляє заготовку
export function checkPoster(fetchedMovies) {
  fetchedMovies.forEach(e => {
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
  // fetchedMovies.results.forEach(el => {
  fetchedMovies.forEach(el => {
    if (!el.title) {
      el.title = el.name;
    }

    el.year = el.release_date ? el.release_date.split('-')[0] : new Date().getFullYear();
    el.genre_names = createGenresMarkup(el.genre_ids);
  });

  return cardsTpl(fetchedMovies);
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
