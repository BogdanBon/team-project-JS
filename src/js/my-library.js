import cardsTpl from '../templates/cards.hbs';
import modalCardTpl from '../templates/modal-card.hbs';
import { showTrailerInner } from './trailer';

import {
  renderCard,
  innerAdd,
  fethByOneCard,
  checkBtnText,
  isFilmInStorage,
} from './fetch-by-one-card';

const refs = {
  btnWatchedEl: document.querySelector('.js-btn-watched'),
  btnQueueEl: document.querySelector('.js-btn-queue'),
  cardsContainer: document.querySelector('#cards-container'),
  modal: document.querySelector('.modal__content'),
  footer: document.querySelector('.footer'),
};

let filmToShow;
let trailerContainer;

refs.btnWatchedEl.addEventListener('click', getStorageWatched);
refs.btnQueueEl.addEventListener('click', getStorageQueue);

export function getStorageWatched(e) {
  refs.btnWatchedEl.classList.add('btn-is-active');
  refs.btnQueueEl.classList.remove('btn-is-active');

  renderAllStorage(e.target.textContent);
  refs.cardsContainer.dataset.page = 'library-watched';

  if (refs.cardsContainer.scrollHeight < window.innerHeight - 320) {
    refs.footer.classList.add('fixed-footer');
  } else {
    refs.footer.classList.remove('fixed-footer');
  }
}

function getStorageQueue(e) {
  refs.btnWatchedEl.classList.remove('btn-is-active');
  refs.btnQueueEl.classList.add('btn-is-active');

  renderAllStorage(e.target.textContent);
  refs.cardsContainer.dataset.page = 'library-queue';

  console.log(refs.cardsContainer.scrollHeight);
  if (refs.cardsContainer.scrollHeight < window.innerHeight - 320) {
    refs.footer.classList.add('fixed-footer');
  } else {
    refs.footer.classList.remove('fixed-footer');
  }
}

export function renderAllStorage(key) {
  const filmsArr = localStorage.getItem(key);
  const parsedFilmsArr = JSON.parse(filmsArr);
  let genreNamesArr = [];

  parsedFilmsArr.forEach(e => {
    e.genres.forEach(e => genreNamesArr.push(e.name));

    if (genreNamesArr.length > 3 || genreNamesArr.length === 0) {
      genreNamesArr = genreNamesArr.slice(0, 2);
      genreNamesArr.push('Others');
    }

    e.genre_names = genreNamesArr.join(', ');

    e.year = e.release_date ? e.release_date.split('-')[0] : new Date().getFullYear();
  });

  refs.cardsContainer.innerHTML = cardsTpl(parsedFilmsArr);

  const cards = document.querySelectorAll('.card__item');

  cards.forEach(el => {
    el.addEventListener('click', fethByOneCard);
  });
}

export function renderOneStorage(e) {
  const idx = e.currentTarget.dataset.id;

  const parsedFilms = isFilmInStorage(idx, 'watched')
    ? JSON.parse(localStorage.getItem('watched'))
    : JSON.parse(localStorage.getItem('queue'));

  filmToShow = parsedFilms.find(e => e.id == idx);

  const markup = modalCardTpl(filmToShow);

  renderCard(markup);

  const addToWatchedBtn = document.querySelector('.modal-btns--watched');
  addToWatchedBtn.addEventListener('click', onAddToWatchedBtn);

  const addToQueueBtn = document.querySelector('.modal-btns--queue');
  addToQueueBtn.addEventListener('click', onAddToQueueBtn);

  const trailerBtn = document.querySelector('.trailer__icon');
  trailerBtn.addEventListener('click', showTrailer);

  trailerContainer = document.querySelector('.trailer__container');

  checkBtnText(addToWatchedBtn, 'watched', filmToShow);

  checkBtnText(addToQueueBtn, 'queue', filmToShow);
}

function onAddToWatchedBtn(e) {
  innerAdd('watched', e.target, filmToShow);
}

function onAddToQueueBtn(e) {
  innerAdd('queue', e.target, filmToShow);
}

function showTrailer(e) {
  showTrailerInner(filmToShow, trailerContainer, refs.modal);
}
