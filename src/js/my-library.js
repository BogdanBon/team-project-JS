import cardsTpl from '../templates/cards.hbs';
import { fethByOneCard } from './fetch-by-one-card';

const refs = {
  btnWatchedEl: document.querySelector('.js-btn-watched'),
  btnQueueEl: document.querySelector('.js-btn-queue'),
  cardsContainer: document.querySelector('#cards-container'),
};

refs.btnWatchedEl.addEventListener('click', checkWatchedList);
refs.btnQueueEl.addEventListener('click', checkQueueList);

export function checkWatchedList() {
  refs.cardsContainer.dataset.page = 'library';
  const filmsWatchedArr = localStorage.getItem('watched');
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

function checkQueueList() {}
