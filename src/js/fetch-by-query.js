import MovieApiService from './movie-service';
import genres from '../json/genres.json';
// import cardTpl from '../templates/my-card.hbs';
import fethByOneCard from './fetch-by-one-card';

const URL = '/search/movie';
const movieApiService = new MovieApiService(URL);

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('#cards-container'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  refs.cardsContainer.innerHTML = '';

  // movieApiService.query = 'tiger';
  movieApiService.query = e.currentTarget.elements.searchQuery.value;
  fetchQuery();
}

async function fetchQuery() {
  const fetchedMovies = await movieApiService.fetchFilms();
  console.log(fetchedMovies);

  const markup = makeMarkup(fetchedMovies);

  renderCards(markup);

  addListenersToCards('.card__list > li');
}

//Добавляет слушателей на все <li>
function addListenersToCards(selector) {
  const cards = document.querySelectorAll(selector);
  cards.forEach(el => {
    el.addEventListener('click', fethByOneCard);
  });
}

// Розмітка всіх карточок
function makeMarkup(fetchedMovies) {
  return fetchedMovies.results
    .map(el => {
      // const genresMarkup = createGenresMarkup(el.genre_ids);
      const year = el.release_date.split('-')[0];
      el.genre_names = createGenresMarkup(el.genre_ids);
      return `<li class="cards__item" data-id=${el.id}><img src="https://image.tmdb.org/t/p/w500${el.poster_path}" alt="" /><p>${el.title}</p><p>${el.genre_names}</p><p>${year}</p></li>`;
    })
    .join('');

  // return шаблон(fetchedMovies.result);
}

// Рендер всіх карточок
function renderCards(markup) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', markup);
}

// Пошук жанру по id
export function findGenrNameById(id) {
  const genr = genres.find(el => el.id === id);
  return genr.name;
}

// Розмітка жанрів: якщо жанрів 1-3, то повертає їх всі, а якщо жанрів 4-..., то повертає лише два і "others"
function createGenresMarkup(genresIdArr) {
  const genresNameArr = genresIdArr.map(el => findGenrNameById(el));

  if (genresIdArr.length > 3) {
    const newGenresArr = genresNameArr.slice(0, 2);
    newGenresArr.push('Others');
    return newGenresArr;
  } else {
    return genresNameArr;
  }
}
