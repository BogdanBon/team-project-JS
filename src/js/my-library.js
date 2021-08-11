import { refs } from './header';
refs.libBtn.addEventListener('click', changeLibraryPage);
refs.cardsContainer = document.querySelector('#cards-container');

console.log(refs.cardsContainer);

function changeLibraryPage(e) {
  refs.form.classList.remove('is-visible');
  refs.notification.classList.remove('is-visible');
  refs.overlayBtn.classList.replace('transform', 'is-visible');
  refs.homeBtn.classList.remove('site-nav__item--current');
  refs.libBtn.classList.add('site-nav__item--current');
  refs.header.classList.replace('imgHome', 'imgLibrary');
}
