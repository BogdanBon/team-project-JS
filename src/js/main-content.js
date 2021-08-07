import MovieService from './movie-service';
import movieTpl from '../templates/cards.hbs'

const newMovieService = new MovieService();

function onSearch() {
    return newMovieService.fetchMovies();
}

onSearch()