/* 
    these imports below are for displaying the detailed info about the selected movie. the main imports allow us to: 

        * retreieve movie id from route url
        * request movie details 
        * display poster, title, rating, runtime, overview, genres, and cast
        * handle the loading and error states
*/

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-movie-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <a routerLink="/" class="back">← Back to Home</a>
        <!-- link to navigate back to the home page -->

        <div *ngIf="loading()" class="loading">Loading movie details...</div>
        <!-- display the loading state while fetching movie details -->

        <div *ngIf="error()" class="error">{{ error() }}</div>
        <!-- display any error messages if the API request fails -->

        <div *ngIf="movie() as mov" class="detail">
            <!-- display movie poster and tagline once they are received -->
            <img [src]="getImage(mov.poster_path)" [alt]="mov.title" />

            <div class="info">
                <h1>{{ mov.title }}</h1>

                <p class="tagline" *ngIf="mov.tagline">{{ mov.tagline }}</p>
                <!-- display movie tagline if it exists -->

                <div class="meta">
                    <!-- display movie rating, release date, and runtime. i used chatgpt to generate this part of the code so that it makes the website feel better. the emojis
                    can be written using unicode characters, but this part was just a copy paste from chatgpt, so i left the emojis as they are.
                    -->
                    <span>⭐ {{ mov.vote_average | number: '1.1-1' }}</span>
                    <span>📅 {{ mov.release_date | date: 'mediumDate' }}</span>
                    <span *ngIf="mov.runtime">🕐 {{ mov.runtime }} min</span>
                </div>

                <p class="overview">{{ mov.overview }}</p>
                <!-- display movie overview -->

                <div *ngIf="mov.genres.length">
                    <!-- display movie genres if they exist -->
                    <h3>Genres</h3>

                    <div class="tags">
                        <!-- display movie genres as tags -->
                        <span *ngFor="let genre of mov.genres">{{ genre.name }}</span>
                    </div>
                </div>

                <div *ngIf="mov.credits?.cast?.length">
                    <!-- display top cast members if they exist -->
                    <h3>Top Cast</h3>

                    <div class="tags">
                        <!-- display top cast members as tags, showing only the first 8 members -->
                        <span *ngFor="let cast of mov.credits!.cast.slice(0, 8)"
                            >{{ cast.name }} <em>as {{ cast.character }}</em></span
                        >
                    </div>
                </div>
            </div>
        </div>
    `,

    styles: [
        `
            .back {
                color: #e94560;
                text-decoration: none;
                display: inline-block;
                margin-bottom: 1.5rem;
                transition: opacity 0.2s;
            }

            .back:hover {
                opacity: 0.7;
            }

            .loading {
                color: white;
                text-align: center;
                padding: 2rem;
            }

            .error {
                color: #e94560;
                text-align: center;
                padding: 2rem;
            }

            .detail {
                display: flex;
                gap: 2.5rem;
                color: white;
                flex-wrap: wrap;
            }
        `,
    ],
})
export class MovieDetailComponent implements OnInit {
    movie = signal<Movie | null>(null); // stores movie obj that we got from the API
    loading = signal(true); // tells us if the movie data is still being fetched from the API or not
    error = signal<string | null>(null); // stores any error messages that may occur during the API request

    constructor(
        private route: ActivatedRoute, // provides access to parameters and allows us to et movie ID from URL
        private movieService: MovieService, // requests the movie details from TMDB API
    ) {}

    ngOnInit(): void {
        // runs when component loads

        const id = Number(this.route.snapshot.paramMap.get('id')); // this is the movie id

        this.movieService.getMovieDetails(id).subscribe({
            next: (res) => {
                //this function is what we use to get the movie details from api. we

                this.movie.set(res);
                this.loading.set(false);

                /* we subscribe to the observable returned by the movie service to get the movie details 
                once the API response is received, we set it to the movie signal and update the loading signal to false 
                which indicates that the data has been loaded and is ready to be displayed in the template.
            */
            },

            error: () => {
                this.error.set('Failed to load movie details.');
                this.loading.set(false);
            },
        });
    }

    // this is ht ehelper function that builds the full image poster url, and if there is no image to display, it puts a placeholder image
    getImage(path: string | null): string {
        return path
            ? `${environment.tmdbImageBaseUrl}${path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
    }
}
