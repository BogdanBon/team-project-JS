import MovieApiService from './movie-service';
import { fetchQuery } from './fetch-by-query';

let checkedGenresArr = [];

const paginationContainer = document.querySelector('#tui-pagination-container');

const movieApiService = new MovieApiService(paginationContainer.dataset.fetchtype);

const genreBtn = document.querySelector('.genres__container');

genreBtn.addEventListener('change', onHendleBtn);

function onHendleBtn(e) {
  // const checkedGenre = e.target.dataset.genre;
  const ppage = 7;
  checkedGenresArr.push(e.target.value);
  movieApiService.url = paginationContainer.dataset.fetchtype;
  movieApiService.page = 7;
  // fetchQuery(movieApiService);
  console.log(checkedGenresArr);
}
