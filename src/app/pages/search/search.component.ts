import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `

    <!--  

        ** the html below has 3 parts: search bar, search results, and movie results in a grid

            * the search bar takes text input and queries the text variable through the ngModel
            * when the client clicks the search button or presses enter, the search() function is called
            
            * search results displays either "no results" or shows the number of results found
            
            * the movie results grid is what shows movie cards (poster) using ngFor
            * upon pressing the movie card, it will go to the movie detail page
            * the movie detail page contains details relating to the movie, sourced from the API

        * movie poster layout and logic is based on the same as the home pae for consistency. 

        ** comments are segmented into the paragraph form the avoid visual clutter with line by line comments **

    -->

        <h1>Search Movies</h1> 

        <div class="search-bar">
            <input
                [(ngModel)]="query"
                (keyup.enter)="search()"
                placeholder="Search for a movie..."
                [disabled]="loading()"
            />
            <button (click)="search()" [disabled]="loading()">
                {{ loading() ? 'Searching...' : 'Search' }}
            </button>
        </div>

        <p
            *ngIf="searched() && movies().length === 0 && !loading()"
            class="no-results"
        >
            No results found for "{{ lastQuery() }}".
        </p>

        <p
            *ngIf="searched() && movies().length > 0"
            class="results-count"
        >
            {{ resultCount() }} results for "{{ lastQuery() }}"
        </p>

        <div class="grid">
            <div
                class="card"
                *ngFor="let movie of movies()"
                [routerLink]="['/movie', movie.id]"
            >
                <img
                    [src]="getImage(movie.poster_path)"
                    [alt]="movie.title"
                    loading="lazy"
                />

                <div class="card-info">
                    <h3>{{ movie.title }}</h3>

                    <div class="card-meta">
                        <span class="rating">
                            ⭐ {{ movie.vote_average | number:'1.1-1' }}
                        </span>
                        <span class="year">
                            {{ movie.release_date | date:'yyyy' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `,

    // css styling for the search page was based on the home page, and parts were adapted from chatgpt as well for custom styling. 
    // css documentation was also majorly used. 

    styles: [
        `
            h1 {
                color: white;
                margin-bottom: 1.5rem;
            }

            .search-bar {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            input {
                flex: 1;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                border: none;
                font-size: 1rem;
                background: #1a1a2e;
                color: white;
                outline: none;
            }

            input:focus {
                box-shadow: 0 0 0 2px #e94560;
            }

            button {
                padding: 0.75rem 1.5rem;
                background: #e94560;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.2s;
            }

            button:hover:not(:disabled) {
                background: #c73652;
            }

            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .no-results,
            .results-count {
                color: #aaa;
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
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
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .card:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(233, 69, 96, 0.3);
            }

            .card img {
                width: 100%;
                display: block;
                aspect-ratio: 2 / 3;
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
        `
    ]
})
export class SearchComponent {

    /*

        here we have the state variables that store the text entered by the client
        result count and the constructor is for automatically recalculating the number of movies returned
            whenever it is updated. 

    */


    query = '';

    // Angular Signals
    movies = signal<Movie[]>([]);
    loading = signal<boolean>(false);
    searched = signal<boolean>(false);
    lastQuery = signal<string>('');

    // Computed signal
    resultCount = computed(() => this.movies().length);

    constructor(private movieService: MovieService) {}


    /*

        below is the search function that is ran when the user types something into the search bar and presses enter or clicks search
        and this function runs validation on the search as a query, runs the API search endpoint, and updates the UI according
        to the response from the API. 

    */

    search(): void {
        if (!this.query.trim()) return;

        this.loading.set(true);
        this.lastQuery.set(this.query);

        this.movieService.searchMovies(this.query).subscribe({
            next: (res) => {
                this.movies.set(res.results);
                this.loading.set(false);
                this.searched.set(true);
            },
            error: () => {
                this.movies.set([]);
                this.loading.set(false);
                this.searched.set(true);
            }
        });
    }

    // the getImage function below is the same as the home.component.ts file

    getImage(path: string | null): string {
        return path
            ? `${environment.tmdbImageBaseUrl}${path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
    }
}