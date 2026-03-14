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
        <a routerLink="/">Back</a>
        <!-- link to navigate back to the home page -->

        <div *ngIf="loading()">Loading...</div>
        <!-- display the loading state while fetching movie details -->

        <div *ngIf="movie() as mov">
            <!-- display movie poster and tagline once they are received -->
            <h1>{{ mov.title }}</h1>
            <img [src]="getImage(mov.poster_path)" />

            <p *ngIf="mov.tagline">{{ mov.tagline }}</p>
            <p>{{ mov.overview }}</p>
        </div>
    `,
})
export class MovieDetailComponent implements OnInit {
    movie = signal<Movie | null>(null); // stores movie obj that we got from the API
    loading = signal(true); // tells us if the movie data is still being fetched from the API or not

    constructor(
        private route: ActivatedRoute, // provides access to parameters and allows us to et movie ID from URL
        private movieService: MovieService, // requests the movie details from TMDB API
    ) {}

    ngOnInit(): void {
        // runs when component loads

        const id = Number(this.route.snapshot.paramMap.get('id')); // this is the movie id

        this.movieService.getMovieDetails(id).subscribe((res) => {
            //this function is what we use to get the movie details from api. we

            this.movie.set(res);
            this.loading.set(false);

            /* we subscribe to the observable returned by the movie service to get the movie details 
                once the API response is received, we set it to the movie signal and update the loading signal to false 
                which indicates that the data has been loaded and is ready to be displayed in the template.
            */
        });
    }

    // this is ht ehelper function that builds the full image poster url, and if there is no image to display, it puts a placeholder image
    getImage(path: string | null): string {
        return path ? `${environment.tmdbImageBaseUrl}${path}` : '';
    }
}
