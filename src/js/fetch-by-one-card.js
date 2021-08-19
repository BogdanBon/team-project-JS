import MovieApiService from './movie-service';
import cardTpl from '../templates/modal-card.hbs';
import noPosterImg from '../images/poster/no-poster.jpg';
import { showLoading, hideLoading, makeNotificationError } from './fetch-by-query';
import { renderAllStorage, renderOneStorage } from './my-library';
import { showTrailerInner } from './trailer';

const refs = {
  modal: document.querySelector('.backdrop'),
  modalContent: document.querySelector('.modal__content'),
  cardsContainer: document.querySelector('#cards-container'),
  footer: document.querySelector('.footer'),
};

let fetchedMovie;

refs.modal.addEventListener('click', onModalClick);

export async function fethByOneCard(el) {
  if (
    isFilmInStorage(el.currentTarget.dataset.id, 'watched') ||
    isFilmInStorage(el.currentTarget.dataset.id, 'queue')
  ) {
    window.addEventListener('keydown', onKeyDown);
    renderOneStorage(el);
    return;
  }

  try {
    const URL = `/movie/${el.currentTarget.dataset.id}`;
    const movieApiService = new MovieApiService(URL);

    showLoading();

    fetchedMovie = await movieApiService.fetchFilms();

    hideLoading();

    checkPoster(fetchedMovie);

    const markup = makeMarkup(fetchedMovie);

    renderCard(markup);

    const addToWatchedBtn = document.querySelector('.modal-btns--watched');
    const addToQueueBtn = document.querySelector('.modal-btns--queue');
    const trailerBtn = document.querySelector('.trailer__icon');
    const trailerContainer = document.querySelector('.trailer__container');

    trailerBtn.addEventListener('click', showTrailer);
    addToWatchedBtn.addEventListener('click', onAddToWatchedBtn);
    addToQueueBtn.addEventListener('click', onAddToQueueBtn);

    checkBtnText(addToWatchedBtn, 'watched', fetchedMovie);

    checkBtnText(addToQueueBtn, 'queue', fetchedMovie);

    function onAddToWatchedBtn(e) {
      innerAdd('watched', e.target, fetchedMovie);
    }

    function onAddToQueueBtn(e) {
      innerAdd('queue', e.target, fetchedMovie);
    }

    function showTrailer(e) {
      showTrailerInner(fetchedMovie, trailerContainer, refs.modalContent);
    }

    window.addEventListener('keydown', onKeyDown);
  } catch (error) {
    console.log(error);

    hideLoading();

    makeNotificationError('Film not found');
  }
}

function onModalClick(e) {
  if (e.target.classList.contains('backdrop') || e.target.classList.contains('modal--close')) {
    closeModal();
  }
}

function onKeyDown(e) {
  if (e.code === 'Escape') {
    closeModal();
    return;
  }
}

function checkPoster(fetchedMovie) {
  fetchedMovie.poster_path = fetchedMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${fetchedMovie.poster_path}`
    : noPosterImg;
}

function makeMarkup(fetchedMovie) {
  return cardTpl(fetchedMovie);
}

export function renderCard(markup) {
  refs.modalContent.insertAdjacentHTML('beforeend', markup);
  refs.modal.classList.remove('visually-hidden');
  document.body.classList.add('backdrop-is-open');
}

function closeModal() {
  window.removeEventListener('keydown', onKeyDown);
  document.body.classList.remove('backdrop-is-open');
  refs.modal.classList.add('visually-hidden');
  refs.modalContent.innerHTML = '';
}

export function innerAdd(key, target, fetchedMovie) {
  const filmsArr = localStorage.getItem(key);
  const parsedFilmsArr = JSON.parse(filmsArr);

  if (target.textContent === `add to ${key}`) {
    parsedFilmsArr.push(fetchedMovie);
    localStorage.setItem(key, JSON.stringify(parsedFilmsArr));
    target.textContent = `remove from ${key}`;
    target.classList.add('modal-btns-active');
  } else {
    const idx = parsedFilmsArr.findIndex(e => e.id === fetchedMovie.id);

    parsedFilmsArr.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(parsedFilmsArr));
    target.textContent = `add to ${key}`;
    target.classList.remove('modal-btns-active');
  }

  if (
    refs.cardsContainer.dataset.page === `library-${key}` &&
    (target.textContent === `add to ${key}` || target.textContent === `remove from ${key}`)
  ) {
    renderAllStorage(key);
  }

  if (refs.cardsContainer.scrollHeight < window.innerHeight - 320) {
    refs.footer.classList.add('fixed-footer');
  } else {
    refs.footer.classList.remove('fixed-footer');
  }
}

export function checkBtnText(btn, btnText, fetchedMovie) {
  if (isFilmInStorage(fetchedMovie.id, btnText)) {
    btn.textContent = `remove from ${btnText}`;
    btn.classList.add('modal-btns-active');
  } else {
    btn.textContent = `add to ${btnText}`;
    btn.classList.remove('modal-btns-active');
  }
}

export function isFilmInStorage(id, key) {
  const filmsArr = localStorage.getItem(key);
  const parsedFilmsArr = JSON.parse(filmsArr);
  return parsedFilmsArr.some(e => e.id == id);
}
