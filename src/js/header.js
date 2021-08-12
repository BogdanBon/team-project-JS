import fetchFilmsOnStartPage from './loading-popular-films-on-start-page';

const refs = {
  siteLogo: document.querySelector('.site-nav__logo'),
  navigationBtn: document.querySelector('.site-nav__list'),
  homeBtn: document.querySelector('.home-js'),
  libBtn: document.querySelector('.library-js'),
  form: document.querySelector('.form'),
  notification: document.querySelector('.notification'),
  overlayBtn: document.querySelector('.overlay'),
  header: document.querySelector('.header'),
};

refs.siteLogo.addEventListener('click', openMainPage);
refs.homeBtn.addEventListener('click', changeHomePage);
refs.libBtn.addEventListener('click', changeLibraryPage);

function changeLibraryPage(e) {
  refs.form.classList.remove('is-visible');
  refs.notification.classList.remove('is-visible');
  refs.overlayBtn.classList.replace('transform', 'is-visible');
  refs.homeBtn.classList.remove('site-nav__item--current');
  refs.libBtn.classList.add('site-nav__item--current');
  refs.header.classList.replace('imgHome', 'imgLibrary');
}

function changeHomePage(e) {
  refs.overlayBtn.classList.replace('is-visible', 'transform');
  refs.form.classList.add('is-visible');
  refs.notification.classList.add('is-visible');
  refs.libBtn.classList.remove('site-nav__item--current');
  refs.homeBtn.classList.add('site-nav__item--current');
  refs.header.classList.replace('imgLibrary', 'imgHome');
  fetchFilmsOnStartPage();
}

function openMainPage(e) {
  changeHomePage();
}

// import

// const btnWatchedEl = document.querySelector('.js-btn-watched');
//     const btnQueueEl = document.querySelector('.js-btn-queue')

//       btnWatchedEl.addEventListener("click", checkWatchedList);
//     btnQueueEl.addEventListener("click", checkQueueList);

//     function checkWatchedList() {

//   }

//   function checkQueueList() {

//   }
