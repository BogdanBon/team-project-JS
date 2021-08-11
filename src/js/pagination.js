
import MovieApiService from './movie-service';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import '../partials/main-content.html';
import card from '../templates/cards'
// import './fetch-by-query';
import { renderCards, makeMarkup } from './fetch-by-query';

const refs = {
    cardList: document.querySelector('.card__list'),
};

const movieApiService = new MovieApiService();

const options = {
    totalItems: 500,
    total_pages: 0,
    itemsPerPage: 20,
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
            '</a>'
    }
};


const pagination = new Pagination('#tui-pagination-container', options);
console.log(pagination);

const page = pagination.getCurrentPage();
console.log(movieApiService)
movieApiService.page=page
movieApiService.fetchFilms().then(response => {
    console.log(response);
    pagination.reset(response.total_pages);
    // renderCard();
    // renderCards(makeMarkup(response))
 });

pagination.on('afterMove', (event) => {
    const activePage = event.page;

    refs.cardList.innerHTML = '';
    movieApiService.page=activePage
    movieApiService.fetchFilms().then(response => {
    //  renderCards(response.results);   
    // renderCard();
        // renderCards(makeMarkup(response));
        console.log(response);
    } )
});

// function renderCard(data) {
//   refs.cardList.insertAdjacentHTML('beforeend', card(data));
// }

// const options1 = {
//     totalItems: 500,
//     itemsPerPage: 10,
//     visiblePages: 5,
// }