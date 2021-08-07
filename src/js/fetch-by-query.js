import MovieApiService from './movie-service';
import genres from '../json/genres.json';

const URL = '/search/movie';
const movieApiService = new MovieApiService(URL);

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('#cards-container'),
};
// console.log(refs.searchForm.elements);

refs.searchForm.addEventListener('submit', onSearch);

// let henresArr = [];

// movieApiService.query = 'tiger';

function onSearch(e) {
  e.preventDefault();

  refs.cardsContainer.innerHTML = '';

  movieApiService.query = 'tiger';
  movieApiService.query = e.currentTarget.elements.searchQuery.value;
  fetchQuery();
}

async function fetchQuery() {
  const fetchedMovies = await movieApiService.fetchFilms();
  console.log(fetchedMovies);
  const markup = makeMarkup(fetchedMovies);
  console.log(markup);
  renderCards(markup);

  // fetchedImages.results.forEach(rez => {
  //   rez.genre_ids.forEach(idx => {
  //     henresArr.push(findGenrNameById(idx));
  //   });
  //   console.log(henresArr);
  //   henresArr = [];
  // });
}

function makeMarkup(fetchedImages) {
  return fetchedImages.results
    .map(el => {
      return `<li><img src="https://image.tmdb.org/t/p/w300${el.poster_path}" alt="" /><p>${el.title}</p></li>`;
      // console.log(el);
    })
    .join('');
}

function renderCards(markup) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', markup);
}

function findGenrNameById(id) {
  const genr = genres.find(el => el.id === id);
  return genr.name;
}
// console.log(filmsApiService.options.params.page);
// import genres from '../JSON/genres.json';
// console.log(genres[5]);
