const API_KEY = '0980f8d9bb3ef32f176d32e94a3ccac0';

const API_URL = 'https://api.themoviedb.org'

export default class MovieService {
    constructor() {
        this.searchQuery = '';
    };

    fetchMovies() {
        return fetch(`${API_URL}/3/trending/movie/day?api_key=${API_KEY}`)
            .then(response => response.json())
            .then(movies => {
                return movies, console.log(movies)
            })
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}