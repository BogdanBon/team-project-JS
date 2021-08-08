import MovieApiService from './movie-service';
import cardTpl from '../templates/modal-card.hbs';

const refs = {
  modal: document.querySelector('.backdrop'),
  modalContent: document.querySelector('.modal__content'),
};

refs.modal.addEventListener('click', closeModal);

export default async function fethByOneCard(el) {
  const URL = `/movie/${el.currentTarget.dataset.id}`;
  const movieApiService = new MovieApiService(URL);

  const fetchedMovie = await movieApiService.fetchFilms();

  console.log(fetchedMovie.title);
  const markup = makeMarkup(fetchedMovie);
  renderCard(markup);

  const closeBtn = document.querySelector('.modal--close');
  closeBtn.addEventListener('click', closeModal);
}

function makeMarkup(fetchedMovie) {
  console.log(fetchedMovie);
  return cardTpl(fetchedMovie);
}

function renderCard(markup) {
  refs.modalContent.innerHTML = '';
  refs.modalContent.insertAdjacentHTML('beforeend', markup);
  refs.modal.classList.remove('visually-hidden');
  document.body.classList.add('backdrop-is-open');
}

function closeModal() {
  document.body.classList.remove('backdrop-is-open');
  refs.modal.classList.add('visually-hidden');
}
