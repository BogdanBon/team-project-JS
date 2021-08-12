import cardsTpl from '../templates/cards.hbs';
import { fethByOneCard } from './fetch-by-one-card';

const refs = {
  btnWatchedEl: document.querySelector('.js-btn-watched'),
  btnQueueEl: document.querySelector('.js-btn-queue'),
  cardsContainer: document.querySelector('#cards-container'),
};

refs.btnWatchedEl.addEventListener('click', getStorageWatched);
refs.btnQueueEl.addEventListener('click', getStorageQueue);

function getStorageWatched(e) {
  renderStorage(e.target.textContent);
  refs.cardsContainer.dataset.page = 'library-watched';
}

function getStorageQueue(e) {
  renderStorage(e.target.textContent);
  refs.cardsContainer.dataset.page = 'library-queue';
}

export function renderStorage(key) {
  const filmsWatchedArr = localStorage.getItem(key);

  const parseWatchedFilmsArr = JSON.parse(filmsWatchedArr);
  let genreNamesArr = [];
  parseWatchedFilmsArr.forEach(e => {
    e.genres.forEach(e => genreNamesArr.push(e.name));

    if (genreNamesArr.length > 3 || genreNamesArr.length === 0) {
      genreNamesArr = genreNamesArr.slice(0, 2);
      genreNamesArr.push('Others');
    }

    e.genre_names = genreNamesArr.join(', ');
  });

  const markup = cardsTpl(parseWatchedFilmsArr);
  refs.cardsContainer.innerHTML = markup;
  const cards = document.querySelectorAll('.card__item');
  cards.forEach(el => {
    el.addEventListener('click', fethByOneCard);
  });
}
