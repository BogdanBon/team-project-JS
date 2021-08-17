import MovieApiService from './movie-service';
import { fetchQuery, findGenrNameById } from './fetch-by-query';
import { pagination } from './pagination';

export let checkedGenresArr = [];
let showMore = true;

const paginationContainer = document.querySelector('#tui-pagination-container');
const searchForm = document.querySelector('#search-form');
const genreBtn = document.querySelector('.genres__container');
const sentinelContainer = document.querySelector('.sentinel__container');
const cardsContainer = document.querySelector('#cards-container');

const optionsObserver = { rootMargin: '200px' };
const sentinelMarkup = '<div id="sentinel"></div>';
const observer = new IntersectionObserver(onEntry, optionsObserver);

const movieApiService = new MovieApiService(paginationContainer.dataset.fetchtype);

genreBtn.addEventListener('change', onHendleBtn);

function onHendleBtn(e) {
  // const checkedGenre = e.target.dataset.genre;
  movieApiService.url = paginationContainer.dataset.fetchtype;
  movieApiService.page = 1;
  movieApiService.query = searchForm.elements.searchQuery.value;

  if (e.target.checked) {
    checkedGenresArr.push(Number(e.target.value));
  } else {
    const idx = checkedGenresArr.findIndex(el => el === Number(e.target.value));
    console.log(idx);
    checkedGenresArr.splice(idx, 1);
  }

  if (checkedGenresArr.length) {
    paginationContainer.classList.add('visually-hidden');

    sentinelContainer.innerHTML = sentinelMarkup;
    const sentinel = document.querySelector('#sentinel');
    observer.observe(sentinel);
  } else {
    paginationContainer.classList.remove('visually-hidden');
    // movieApiService.page = 1;
    // movieApiService.url = paginationContainer.dataset.fetchtype;
    pagination.reset(movieApiService.totalResults);
    sentinelContainer.innerHTML = '';
  }

  if (paginationContainer.classList.contains('visually-hidden')) {
    console.log('movieApiService');

    cardsContainer.innerHTML = '';
  } else {
  }

  fetchQuery(movieApiService);

  // const totalResults = fetchedImages.totalHits;
  // const currentPage = imagesApiService.page;
  // const perPage = imagesApiService.options.params.per_page;
}

export function filterMovies(fetchedMovies) {
  let filteredMovies = [];

  fetchedMovies.forEach(film => {
    if (checkedGenresArr.every(el => film.genre_ids.includes(el))) {
      filteredMovies.push(film);
    }
  });

  return filteredMovies;
}

export function checkImagesCount(total, current) {
  if (current >= total) {
    sentinel.textContent = "We're sorry, but you've reached the end of search results.";

    showMore = false;
  }
}

function onEntry(entries) {
  entries.forEach(entry => {
    // if (entry.isIntersecting && movieApiService.page !== 1 && showMore) {
    //   fetchQuery(movieApiService);
    // }
    if (entry.isIntersecting) {
      console.log('in');
      movieApiService.page += 1;
      fetchQuery(movieApiService);
    }
  });
}
