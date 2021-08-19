import MovieApiService from './movie-service';
import { fetchQuery } from './fetch-by-query';
import { pagination } from './pagination';

export let checkedGenresArr = [];
let showMore = true;

const paginationContainer = document.querySelector('#tui-pagination-container');
const searchForm = document.querySelector('#search-form');
const genreContainer = document.querySelector('.genres__container');
const cardsContainer = document.querySelector('#cards-container');

const optionsObserver = { rootMargin: '10px' };
export const observer = new IntersectionObserver(onEntry, optionsObserver);
const sentinel = document.querySelector('#sentinel');

const movieApiService = new MovieApiService(paginationContainer.dataset.fetchtype);

genreContainer.addEventListener('change', onHendleBtn);

async function onHendleBtn(e) {
  sentinel.classList.add('visually-hidden');

  movieApiService.page = 1;
  movieApiService.query = searchForm.elements.searchQuery.value;

  if (e.target.checked) {
    checkedGenresArr.push(Number(e.target.value));
    e.tar;
  } else {
    const idx = checkedGenresArr.findIndex(el => el === Number(e.target.value));
    checkedGenresArr.splice(idx, 1);
  }

  if (checkedGenresArr.length) {
    observer.observe(sentinel);

    paginationContainer.classList.add('visually-hidden');

    if (paginationContainer.dataset.fetchtype === '/trending/movies/day') {
      movieApiService.url = '/movie/top_rated';
    } else {
      movieApiService.url = '/search/movie';
    }

    if (movieApiService.query === '') {
      movieApiService.url = '/movie/top_rated';
    }
  } else {
    paginationContainer.classList.remove('visually-hidden');
    movieApiService.url = paginationContainer.dataset.fetchtype;
    observer.unobserve(sentinel);
  }

  cardsContainer.innerHTML = '';

  await fetchQuery(movieApiService);

  pagination.reset(movieApiService.totalResults);
}

export function filterMovies(fetchedMovies) {
  let filteredMovies = [];

  fetchedMovies.forEach(film => {
    if (!film.genre_ids) {
      return [];
    }
    if (checkedGenresArr.every(el => film.genre_ids.includes(el))) {
      filteredMovies.push(film);
    }
  });

  return filteredMovies;
}

export function checkImagesCount(total, current) {
  if (current >= total) {
    sentinel.classList.remove('visually-hidden');
    showMore = false;
  } else {
    showMore = true;
  }
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && showMore) {
      movieApiService.page += 1;
      fetchQuery(movieApiService);
    }
  });
}
