import { fetchFilmsOnStartPage, movieApiService } from './loading-popular-films-on-start-page';
import { renderAllStorage } from './my-library';
import { pagination } from './pagination';
import { fetchQuery } from './fetch-by-query';

export const refs = {
  siteLogo: document.querySelector('.site-nav__logo'),
  navigationBtn: document.querySelector('.site-nav__list'),
  homeBtn: document.querySelector('.home-js'),
  libBtn: document.querySelector('.library-js'),
  form: document.querySelector('.form'),
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('.search-form__input'),
  searchFormTitle: document.querySelector('.search-form__title'),
  notification: document.querySelector('.notification'),
  overlayBtn: document.querySelector('.overlay'),
  header: document.querySelector('.header'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
  cardsContainer: document.querySelector('#cards-container'),
  btnWatchedEl: document.querySelector('.js-btn-watched'),
  btnQueueEl: document.querySelector('.js-btn-queue'),
};

refs.siteLogo.addEventListener('click', changeHomePage);
refs.homeBtn.addEventListener('click', changeHomePage);
refs.libBtn.addEventListener('click', changeLibraryPage);

function changeLibraryPage(e) {
  refs.form.classList.remove('is-visible');
  refs.notification.classList.remove('is-visible');
  refs.overlayBtn.classList.replace('transform', 'is-visible');
  refs.homeBtn.classList.remove('site-nav__item--current');
  refs.libBtn.classList.add('site-nav__item--current');
  refs.header.classList.replace('imgHome', 'imgLibrary');
  refs.cardsContainer.innerHTML = '';
  refs.paginationContainer.classList.add('visually-hidden');
  refs.cardsContainer.dataset.page = 'library';
  refs.btnWatchedEl.classList.add('btn-is-active');
  refs.btnQueueEl.classList.remove('btn-is-active');

  renderAllStorage('watched');
  refs.cardsContainer.dataset.page = 'library-watched';
}

function changeHomePage(e) {
  refs.overlayBtn.classList.replace('is-visible', 'transform');
  refs.form.classList.add('is-visible');
  refs.libBtn.classList.remove('site-nav__item--current');
  refs.homeBtn.classList.add('site-nav__item--current');
  refs.header.classList.replace('imgLibrary', 'imgHome');
  refs.cardsContainer.innerHTML = '';

  refs.paginationContainer.classList.remove('visually-hidden');
  refs.notification.classList.remove('is-visible');
  refs.btnWatchedEl.classList.add('btn-is-active');

  refs.cardsContainer.dataset.page = 'home';
  movieApiService.query = '';
  refs.input.value = '';
  movieApiService.page = 1;
  movieApiService.options.url = '/trending/movies/day';
  refs.paginationContainer.dataset.fetchtype = '/trending/movies/day';
  pagination.reset(20000);

  fetchQuery(movieApiService);
}
