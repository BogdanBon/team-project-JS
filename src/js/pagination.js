import '../sass/main.css';
import '../js/main-content';
import '../js/movie-service';
import MovieApiService from '../js/movie-service';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import '../partials/main-content.html';
import card from '../templates/cards.hbs';
import './fetch-by-query';

const refs = {
    cardList: document.querySelector('.card-list'),
};

const movieApiService = new MovieApiService();

const options = {
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

const page = pagination.getCurrentPage();

movieApiService.fetchQuery(page).then(response => {
    console.log(response);
    pagination.reset(response.total_pages);
     changeGallery(response.results);
 });

pagination.on('afterMove', (event) => {
    const activePage = event.page;

    refs.cardList.innerHTML = '';

    movieApiService.fetchFilm(activePage).then(response => {
        renderCard(response.results);
    } )
});

 function renderCard(data) {
    refs.cardList.insertAdjacentHTML('beforeend', card(data));
}
    