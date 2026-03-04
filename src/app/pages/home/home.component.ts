// for the imports, we have angular Components, OnInit runs when the component is initialized, and computed is value from other signals
// the commonModule gives us angular directives like 'ngIf' and 'ngFor'
// routerLink allows for navigation to other routes when interacted with
// MovieService is what handles the API fetch data
// Movie comes from the interface file which is the structure of the movie object
// environment import contains the TMDB API and other URL's needed for the movie objects

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home', // html tag for this component
    standalone: true, // doesn't need external angular declaration
    imports: [CommonModule, RouterLink], // these imports are for the template that we'll be using
    template: `
        <!-- 

        In the Html code, we have a header as the h1 tag suggests, followed by some text in the P tag
        loading and error states are handled through ngif and ngfor within the div tags. 
        grid class in the div tag is responsible for displaying the movie cards with the image of the movies
        coming from the API using getImage. the card info div class then shows us the container for the information of the movie
        , the name of the movie in th h3 tag, and rating/release as a span tag. 

        the html is then followed by the css styles local to the home page, this portion of the code
        was done with help from 'chatGpt' as well as some css documentation. 
    
    
    -->

        <h1>Trending This Week</h1>
        <p class="subtitle">{{ movieCount() }} movies loaded</p>

        <div *ngIf="loading()" class="loading">Loading trending movies</div>
        <div *ngIf="error()" class="error">{{ error() }}</div>

        <div class="grid" *ngIf="!loading()">
            <div class="card" *ngFor="let movie of movies()" [routerLink]="['/movie', movie.id]">
                <img [src]="getImage(movie.poster_path)" [alt]="movie.title" loading="lazy" />
                <div class="card-info">
                    <h3>{{ movie.title }}</h3>
                    <div class="card-meta">
                        <span class="rating">⭐ {{ movie.vote_average | number: '1.1-1' }}</span>
                        <span class="year">{{ movie.release_date | date: 'yyyy' }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,

    styles: [
        `
            h1 {
                color: white;
                margin-bottom: 0.25rem;
            }
            .subtitle {
                color: #aaa;
                margin-bottom: 1.5rem;
                font-size: 0.9rem;
            }
            .loading,
            .error {
                color: white;
                text-align: center;
                padding: 2rem;
            }
            .error {
                color: #e94560;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 1.5rem;
            }

            .card {
                background: #1a1a2e;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition:
                    transform 0.2s,
                    box-shadow 0.2s;
            }

            .card:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(233, 69, 96, 0.3);
            }
            .card img {
                width: 100%;
                display: block;
                aspect-ratio: 2/3;
                object-fit: cover;
            }
            .card-info {
                padding: 0.75rem;
                color: white;
            }
            .card-info h3 {
                font-size: 0.9rem;
                margin: 0 0 0.4rem;
            }
            .card-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
            }
            .rating {
                color: #f5c518;
            }
            .year {
                color: #aaa;
            }
        `,
    ],
})
export class HomeComponent implements OnInit {
    // angular signals for reactive state management

    movies = signal<Movie[]>([]); // this array holds the movies fetched from the API
    loading = signal<boolean>(true); // tracker for whether website is loading data or not
    error = signal<string | null>(null); // stores error message if API fails

    // computed signal which automatically updates when the movies signal changes
    movieCount = computed(() => this.movies().length);

    constructor(private movieService: MovieService) {} // we use this to allow movieservice injection into the component

    // this void function runs, when the component is first loaded
    ngOnInit(): void {
        this.movieService.getTrending().subscribe({
            next: (res) => { // if the API request is successful, do the following
                this.movies.set(res.results);
                this.loading.set(false);
            },
            error: (err) => { // if API request fails, do the following
                this.error.set('Failed to load movies. Please try again.');
                this.loading.set(false);
            },
        });
    }

    // this is a helper function i created that essentially builds the image url from the api response, if the path is null, then it returns a placeholder image url
    getImage(path: string | null): string { 
        return path
            ? `${environment.tmdbImageBaseUrl}${path}`
            : 'https://via.placeholder.com/300x450?text=No+Image';
    }
}

// this component is responsible for fetching and displaying the trending movies on the home page.
// it uses the MovieService to fetch data from the TMDB API and manages loading and error states using Angular signals.
