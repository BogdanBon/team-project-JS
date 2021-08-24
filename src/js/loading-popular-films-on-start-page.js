import { showLoading, hideLoading, addListenersToCards } from './fetch-by-query';
import { pagination } from './pagination';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';

export const URL = '/trending/movies/day';
export const movieApiService = new MovieApiService(URL);

const paginationContainer = document.querySelector('#tui-pagination-container');
const cardsContainer = document.querySelector('#cards-container');

export async function fetchFilmsOnStartPage() {
  try {
    showLoading();
    const fetchFilms = await movieApiService.fetchFilms();
    hideLoading();
    paintMarUp(fetchFilms);
    pagination.reset(fetchFilms.total_results);
    addListenersToCards('.card__item');
  } catch {
    error => console.log(error);
    hideLoading();
  }
}

export function paintMarUp(markup) {
  addUrl(markup.results);
  addYear(markup.results);
  addTitle(markup.results);
  genresIdToGenresName(markup.results);

  const paintingData = cardsTpl(markup.results);

  cardsContainer.innerHTML = paintingData;
}

function addUrl(data) {
  data.forEach(el => {
    el.poster_path = `https://image.tmdb.org/t/p/w500${el.poster_path}`;
  });
}

function addYear(data) {
  data.forEach(el => {
    if (!el.release_date) {
      el.year = Number.parseInt(el.first_air_date);
      return;
    }

    if (!el.release_date && !el.first_air_date) {
      el.year = 'No film date';
      return;
    }

    el.year = Number.parseInt(el.release_date);
  });
}

function addTitle(data) {
  data.forEach(el => {
    if (!el.title) {
      el.title = el.name;
    }

    if (!el.title && !el.name) {
      el.title = 'No film name';
    }
  });
}

function genresIdToGenresName(arrayFilms) {
  arrayFilms.map(film => {
    const genreIds = film.genre_ids;
    film.genre_names = findAndSortGenres(genreIds);
  });
  return arrayFilms;
}

// function findAndSortGenres(arrayIds) {
//   const idsNames = [];

//   arrayIds.forEach(id => {
//     for (const genre of genres) {
//       if (genre.id === id) {
//         idsNames.push(genre.name);
//         break;
//       }
//     }
//   });

//   if (idsNames.length === 0) {
//     idsNames.push('Others');
//   }

//   if (idsNames.length >= 3) {
//     idsNames.splice(2, 5, 'Others');
//   }

//   return idsNames.join(', ');
// }

function findAndSortGenres(arrayIds) {
  const idsNames = arrayIds.reduce((allIds, id) => {
    for (const genre of genres) {
      if (genre.id === id) {
        allIds.push(genre.name);
        break;
      }
    }
    return allIds;
  }, []);

  if (idsNames.length === 0) {
    idsNames.push('Others');
  }

  if (idsNames.length >= 3) {
    idsNames.splice(2, 5, 'Others');
  }

  return idsNames.join(', ');
}

fetchFilmsOnStartPage();

export default fetchFilmsOnStartPage;
