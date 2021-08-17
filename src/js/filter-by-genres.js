import MovieApiService from './movie-service';
import { fetchQuery, findGenrNameById } from './fetch-by-query';
import { pagination } from './pagination';

export let checkedGenresArr = [];
let showMore = true;
let countFilms = 0;

const paginationContainer = document.querySelector('#tui-pagination-container');
const searchForm = document.querySelector('#search-form');
const genreContainer = document.querySelector('.genres__container');
const sentinelContainer = document.querySelector('.sentinel__container');
const cardsContainer = document.querySelector('#cards-container');
const genreBtns = document.querySelectorAll('.genres__checkbox');

const optionsObserver = { rootMargin: '10px' };
export const observer = new IntersectionObserver(onEntry, optionsObserver);
const sentinel = document.querySelector('#sentinel');

// const sentinelMarkup = '<div id="sentinel"></div>';

const movieApiService = new MovieApiService(paginationContainer.dataset.fetchtype);

genreContainer.addEventListener('change', onHendleBtn);

async function onHendleBtn(e) {
  // const checkedGenre = e.target.dataset.genre;
  movieApiService.url = paginationContainer.dataset.fetchtype;
  movieApiService.page = 1;
  movieApiService.query = searchForm.elements.searchQuery.value;

  if (e.target.checked) {
    checkedGenresArr.push(Number(e.target.value));
  } else {
    const idx = checkedGenresArr.findIndex(el => el === Number(e.target.value));
    checkedGenresArr.splice(idx, 1);
  }

  observer.unobserve(sentinel);

  // if (paginationContainer.classList.contains('visually-hidden')) {
  //   console.log('movieApiService');

  //   cardsContainer.innerHTML = '';
  // } else {
  //   cardsContainer.innerHTML = '';
  // }

  cardsContainer.innerHTML = '';

  await fetchQuery(movieApiService);

  if (checkedGenresArr.length) {
    observer.observe(sentinel);
    paginationContainer.classList.add('visually-hidden');
  } else {
    paginationContainer.classList.remove('visually-hidden');
  }

  pagination.reset(movieApiService.totalResults);

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
      //   console.log('in');

      //   countFilms = 0;
      //   movieApiService.page += 1;
      //   do {
      //     fetchQuery(movieApiService);
      //     movieApiService.page += 1;

      //     countFilms += movieApiService.films.length;
      //     console.log(countFilms);
      //     console.log(movieApiService);
      //   } while (countFilms < 5);
      // movieApiService.page -= 1;

      movieApiService.page += 1;
      fetchQuery(movieApiService);
    }
  });
}
