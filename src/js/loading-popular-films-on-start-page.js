import { showLoading, hideLoading } from './fetch-by-query';
import MovieApiService from './movie-service';
import genres from '../json/genres.json';
import cardsTpl from '../templates/cards.hbs';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

export const URL = '/trending/movies/day';
const cardsContainer = document.querySelector('#cards-container');

export const movieApiService = new MovieApiService(URL);

function paginationInit(fetchFilms) {
  if (fetchFilms && fetchFilms.results) {
    const refs = {
      cardList: document.querySelector('.card__list'),
    };

    const options = {
      totalItems: fetchFilms.total_pages,
      total_pages: 0,
      itemsPerPage: fetchFilms.results.length,
      visiblePages: 5,
      page: 1,
      centerAlign: true,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      template: {
        page: '<a href="#" class="tui-page-btn">{{page}}</a>',
        currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
        moveButton:
          '<a href="#" class="tui-page-btn tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</a>',
        disabledMoveButton:
          '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</span>',
        moreButton:
          '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
          '<span class="tui-ico-ellip">...</span>' +
          '</a>',
      },
    };
    const pagination = new Pagination('#tui-pagination-container', options);

    pagination.on('afterMove', async event => {
      const activePage = event.page;

      refs.cardList.innerHTML = '';
      movieApiService.page = activePage;

      const fetchFilms = await movieApiService.fetchFilms();
      await paintMarUp(fetchFilms);
    });
  }
}

export async function fetchFilmsOnStartPage() {
  try {
    showLoading();
    const fetchFilms = await movieApiService.fetchFilms();
    hideLoading();
    paginationInit(fetchFilms);
    await paintMarUp(fetchFilms);
  } catch {
    error => console.log(error);
  }
}

export function paintMarUp(markup) {
  addUrl(markup.results);
  genresIdToGenresName(markup.results);
  // ${Number.parseInt(el.release_date)}
  const paintingData = cardsTpl(markup.results);

  cardsContainer.innerHTML = paintingData;
}

function addUrl(data) {
  data.forEach(el => {
    el.poster_path = `https://image.tmdb.org/t/p/w500${el.poster_path}`;

    if (el.release_date === undefined) {
      // el.release_date = 2020;
      el.year = 2020;
      return;
    }

    el.year = Number.parseInt(el.release_date);
    // el.release_date = Number.parseInt(el.release_date);
  });
}

function genresIdToGenresName(arrayFilms) {
  arrayFilms.map(film => {
    const genreIds = film.genre_ids;
    film.genre_names = findAndSortGenres(genreIds);
    // console.log(film.genre_names);
  });
  return arrayFilms;
}

function findAndSortGenres(arraIds) {
  const idsNames = [];

  arraIds.forEach(id => {
    for (const genre of genres) {
      if (genre.id === id) {
        idsNames.push(genre.name);
        break;
      }
    }
  });

  if (idsNames.length === 0) {
    idsNames.push('Others');
  }

  if (idsNames.length >= 3) {
    idsNames.splice(2, 5, 'Others');
  }

  return idsNames.join(', ');
}

fetchFilmsOnStartPage();
