import MovieApiService from './movie-service';
import { fetchQuery } from './fetch-by-query';

const paginationContainer = document.querySelector('#tui-pagination-container');

const movieApiService = new MovieApiService(paginationContainer.dataset.fetchtype);

const genreBtn = document.querySelector('.genres__container');

genreBtn.addEventListener('click', onHendleBtn);

function onHendleBtn(e) {
  const checkedGenre = e.target.dataset.genre;
  const ppage = 7;
  movieApiService.url = paginationContainer.dataset.fetchtype;
  movieApiService.page = 7;
  fetchQuery(movieApiService);
  console.log(movieApiService.url);
}
