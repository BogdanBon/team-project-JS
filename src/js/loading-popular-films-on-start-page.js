import MovieApiService from './movie-service';
import genres from '../json/genres.json';

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
  const paintingData = markup.results
    .map(el => {
      genresIdToGenresName(el.genre_ids);

      return `<li><img src="https://image.tmdb.org/t/p/w300${el.poster_path}" alt="${el.title}" />
        <p>${el.title}</p>
        <p>${Number.parseInt(el.release_date)}</p>
        <p>${el.vote_average}</p></li>`;
    })
    .join('');

  cardsContainer.innerHTML = paintingData;
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
