import { showLoading, hideLoading, addListenersToCards } from './fetch-by-query';
import { pagination } from './pagination';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';

export const URL = '/trending/movies/day';
export const movieApiService = new MovieApiService(URL);

const cardsContainer = document.querySelector('#cards-container');

export async function fetchFilmsOnStartPage() {
  try {
    showLoading();
    const fetchFilms = await movieApiService.fetchFilms();
    hideLoading();
    await paintMarUp(fetchFilms);
    pagination.reset(fetchFilms.total_results);
    addListenersToCards('.card__item');
  } catch {
    error => console.log(error);
    hideLoading();
  }
}

export function paintMarUp(markup) {
  addUrl(markup.results);
  genresIdToGenresName(markup.results);

  const paintingData = cardsTpl(markup.results);

  cardsContainer.innerHTML = paintingData;
}

function addUrl(data) {
  data.forEach(el => {
    el.poster_path = `https://image.tmdb.org/t/p/w500${el.poster_path}`;

    if (!el.title) {
      el.title = el.name;
    }

    if (el.release_date === undefined) {
      el.year = new Date().getFullYear();
      return;
    }

    el.year = Number.parseInt(el.release_date);
  });
}

function genresIdToGenresName(arrayFilms) {
  arrayFilms.map(film => {
    const genreIds = film.genre_ids;
    film.genre_names = findAndSortGenres(genreIds);
  });
  return arrayFilms;
}

function findAndSortGenres(arraIds) {
  const idsNames = [];

  arraIds.forEach(id => {
    for (const genre of genres) {
      if (genre.id === id) {
        idsNames.push(genre.name);
        break;
      }
    }
  });

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
