import MovieApiService from './movie-service';
import cardTpl from '../templates/modal-card.hbs';
import noPosterImg from '../images/poster/no-poster.jpg';

const refs = {
  modal: document.querySelector('.backdrop'),
  modalContent: document.querySelector('.modal__content'),
};

refs.modal.addEventListener('click', onModalClick);

export async function fethByOneCard(el) {
  try {
    const URL = `/movie/${el.currentTarget.dataset.id}`;
    const movieApiService = new MovieApiService(URL);
    const fetchedMovie = await movieApiService.fetchFilms();

    checkPoster(fetchedMovie);

    const markup = makeMarkup(fetchedMovie);

    renderCard(markup);
    // ---------------------------------------------------

    const addToWatchedBtn = document.querySelector('.modal-btns--watched');
    const addToQueueBtns = document.querySelector('.modal-btns--queue');

    addToWatchedBtn.addEventListener('click', onAddToWatchedBtn);
    addToQueueBtns.addEventListener('click', onAddToQueueBtns);
    const films = [];
    // addToWatchedBtn.watched = fetchedMovie;
    function onAddToWatchedBtn(e) {
      // console.dir(e.target.watched);
      films.push(fetchedMovie);

      localStorage.setItem('watched', JSON.stringify(films));
      
      const film = localStorage.getItem('watched');
      const parseFilm = JSON.parse(film);
      console.log(films);
      return addToArr(parseFilm);
    }

    function addToArr(parseFilm) {
      films.push(parseFilm);
      localStorage.setItem('watched', JSON.stringify(films));
      return films;
    }
    console.log(films);
    
    function onAddToQueueBtns(e) {
      console.log('queue');
      localStorage.setItem('queue', fetchedMovie);
    }

    // ---------------------------------------------
    window.addEventListener('keydown', onKeyDown);
  } catch (error) {
    console.log(error);
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

function renderCard(markup) {
  refs.modalContent.innerHTML = '';
  refs.modalContent.insertAdjacentHTML('beforeend', markup);
  refs.modal.classList.remove('visually-hidden');
  document.body.classList.add('backdrop-is-open');
}

function closeModal() {
  window.removeEventListener('keydown', onKeyDown);
  document.body.classList.remove('backdrop-is-open');
  refs.modal.classList.add('visually-hidden');
}
