import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';

const URL = '/trending/movies/day';
const cardsContainer = document.querySelector('#cards-container');

const movieApiService = new MovieApiService(URL);

async function fetchFilmsOnStartPage() {
  try {
    const fetchFilms = await movieApiService.fetchFilms();
    await paintMarUp(fetchFilms);
  } catch {
    error => console.log(error);
  }
}

function paintMarUp(markup) {
  addUrl(markup.results);
  genresIdToGenresName(markup.results);
  // ${Number.parseInt(el.release_date)}
  const paintingData = cardsTpl(markup.results);

  cardsContainer.innerHTML = paintingData;
}

function addUrl(data) {
  data.forEach(el => {
    el.poster_path = `https://image.tmdb.org/t/p/w500${el.poster_path}`;

    if (el.release_date === undefined) {
      // el.release_date = 2020;
      el.year = 2020;
      return;
    }

    el.year = Number.parseInt(el.release_date);
    // el.release_date = Number.parseInt(el.release_date);
  });
}

function genresIdToGenresName(arrayIds) {
  const idsNames = [];

  arrayIds.forEach(id => {
    for (const genre of genres) {
      if (genre.id === id) {
        idsNames.push(genre.name);
        break;
      }
    }
  });
  return idsNames;
}

fetchFilmsOnStartPage();
