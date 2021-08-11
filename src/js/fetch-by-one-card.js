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
    // FT-18 По нажатию на кнопку "Add to watched" фильм добавляется в просмотренные фильмы текущего пользователя (local-storage)
    const addToWatchedBtn = document.querySelector('.modal-btns--watched');
    addToWatchedBtn.addEventListener('click', onAddToWatchedBtn);
    const filmsWatchedArr = localStorage.getItem('watched');
    const parseWatchedFilmsArr = JSON.parse(filmsWatchedArr);

    if (parseWatchedFilmsArr.some(o => o.id === fetchedMovie.id)) {
      addToWatchedBtn.textContent = 'delete film';
    } else {
      addToWatchedBtn.textContent = 'add to Watched';
    }

    function onAddToWatchedBtn(e) {
      if (e.target.textContent === 'add to Watched') {
        parseWatchedFilmsArr.push(fetchedMovie);
        localStorage.setItem('watched', JSON.stringify(parseWatchedFilmsArr));
        e.target.textContent = 'delete film';
      } else {
        const idx = parseWatchedFilmsArr.findIndex(e => e.id === fetchedMovie.id);
        parseWatchedFilmsArr.splice(idx, 1);
        localStorage.setItem('watched', JSON.stringify(parseWatchedFilmsArr));
        e.target.textContent = 'add to Watched';
      }
    }

    // FT-19 По нажатию на кнопку "Add to queue" фильм добавляется в очередь текущего пользователя (local-storage)
    const addToQueueBtns = document.querySelector('.modal-btns--queue');
    addToQueueBtns.addEventListener('click', onAddToQueueBtns);

    function onAddToQueueBtns(e) {
      const filmsQueueArr = localStorage.getItem('queue');
      const parseQueuefilmsArr = JSON.parse(filmsQueueArr);

      if ((e.target.textContent = 'add to queue')) {
        e.target.textContent = 'delete film';
      }

      if (parseQueuefilmsArr.some(o => o.id === fetchedMovie.id)) {
        parseQueuefilmsArr.splice(parseQueuefilmsArr.length - 1, 1);
        localStorage.setItem('queue', JSON.stringify(parseQueuefilmsArr));
        addToQueueBtns.textContent = 'add to queue';
      } else parseQueuefilmsArr.push(fetchedMovie);
      localStorage.setItem('queue', JSON.stringify(parseQueuefilmsArr));
      return console.log(parseQueuefilmsArr);
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
