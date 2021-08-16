import MovieApiService from './movie-service';
import { showLoading, hideLoading, makeNotificationError } from './fetch-by-query';

import trailerTpl from '../templates/trailer.hbs';

export async function showTrailerInner(fetchedMovie, trailerContainer, modal) {
  try {
    const trailerApiService = new MovieApiService(`/movie/${fetchedMovie.id}/videos`);

    showLoading();

    const fetchedTrailer = await trailerApiService.fetchFilms();

    hideLoading();

    fetchedTrailer.sourse = `https://www.youtube.com/embed/${fetchedTrailer.results[0].key}`;

    const markup = trailerTpl(fetchedTrailer);

    renderTrailer(markup, trailerContainer);

    modal.classList.add('trailer-is-open');
  } catch (error) {
    console.log(error);

    hideLoading();

    makeNotificationError('Film not found');
  }
}

function renderTrailer(markup, container) {
  container.innerHTML = markup;
  container.classList.remove('visually-hidden');
}
