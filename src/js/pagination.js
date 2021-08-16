import MovieApiService from './movie-service';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';
import { fetchQuery } from './fetch-by-query';

const refs = {
  cardList: document.querySelector('.card__list'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
  searchForm: document.querySelector('#search-form'),
  notification: document.querySelector('.notification'),
};

const movieApiService = new MovieApiService('/trending/movies/day');

const options = {
  totalItems: 0,
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
};

export const pagination = new Pagination('#tui-pagination-container', options);

movieApiService.page = pagination.getCurrentPage();

pagination.on('afterMove', event => {
  refs.cardList.innerHTML = '';
  refs.notification.classList.remove('is-visible');

  movieApiService.page = event.page;
  movieApiService.url = refs.paginationContainer.dataset.fetchtype;
  movieApiService.query = refs.searchForm.elements.searchQuery.value;

  fetchQuery(movieApiService);
});
