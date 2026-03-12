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

        <div *ngIf="loading()">Loading...</div>
        
        <div *ngIf="movie() as mov">
            <h1>{{ mov.title }}</h1>
            <img [src]="getImage(mov.poster_path)" />

            <p *ngIf="mov.tagline">{{ mov.tagline }}</p>
            <p>{{ mov.overview }}</p>


        </div>
    `
})


export class MovieDetailComponent implements OnInit { 

    movie = signal<Movie | null>(null);
    loading = signal(true);

    constructor(

        private route: ActivatedRoute,
        private movieService: MovieService  
    ) {}

    ngOnInit(): void {

        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.movieService.getMovieDetails(id).subscribe(res => {

            this.movie.set(res);
            this.loading.set(false);

        });
    }

    getImage(path: string | null): string { 
        
        return path

        ? `${environment.tmdbImageBaseUrl}${path}`
        : '';
    }
}
