import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieResponse } from '../models/movie.interface';

// note: the Angular service here is required and responsible for all the HTTP communications

// the tmdb RESTapi is what the HTTP communicates with 

// the web architecture for this project is based on a client - server model, where the client is 
// this website we are making using the angular framework, and the server side is the 
// underlying, HTTP GET requests going from the client to the server
// the server being the movie database API, and then the server send JSON responses
// which is then received by the client side

// authentication is handled through the autorization header, which is a standard way to send credentials in HTTP requests.
// here it is using a bearer token, which acts as a gateway between autheticantion and the API. 

// injectable tells angular that that this can be used as a shared instance. 
@Injectable({ providedIn: 'root' })
export class MovieService { // base endpoint for storing the environment configurations

    private baseUrl = environment.tmdbBaseUrl; 
    private headers = new HttpHeaders({
        Authorization: `Bearer ${environment.tmdbApiKey}`,
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient) {}

    // RxJS Observable is used to handle asynchronous data streams, which is common in HTTP requests.
    getTrending(): Observable<MovieResponse> { // observable becasue of anonymous nature and component subscription when data arrives. 
        return this.http.get<MovieResponse>(
            `${this.baseUrl}/trending/movie/week`, 
            { headers: this.headers }
        );
    }

    searchMovies(query: string): Observable<MovieResponse> {
        return this.http.get<MovieResponse>( 
            `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`, // solution to special characters and spaces
            { headers: this.headers }
        );
    }

    getMovieDetails(id: number): Observable<Movie> {
        return this.http.get<Movie>(
            `${this.baseUrl}/movie/${id}?append_to_response=credits`, 
            { headers: this.headers }
        );
    }
}



// reference links for above code: 

// https://angular.io/api/core/Injectable
// https://angular.dev/guide/http/setup
// https://angular.dev/guide/http/interceptors#defining-an-interceptor
// https://developer.themoviedb.org/docs/authentication-application

// Note: this file is where all the API calls are made, and the data is fetched from the API.
// includes: api endpoints, authentication, data fetching
