// this is the interface model for the application which includes genre, CastMembers, Credits, Movie, and 
// In this file we define the structure that describes the data coming from the api. 
// the fields in the various interfaces are data that the API provides for each movie, and we store them in variables. 


export interface Genre { // this interface provides genre data
    id: number; // numerical identifier for the genre (suppose: sci-fi = 1, action - 10, etc.)
    name: string; // name of the genre (sci-fi, action, comedy, etc.)
}

export interface CastMember { // provides a single actor from a list of movie actors from the API
    id: number; // numerical identifier for the cast member (actor)
    name: string; // name of the cast member (actor)
    character: string; // name of the actor in the movie
    profile_path: string | null; // the reason we have null, is that if the cast member does not have a profile image, having null prevents any runtime errors.
}

export interface Credits { // this interface provides the cast data for a movie, which is an array of CastMember objects
    cast: CastMember[]; 
}

export interface Movie { // this interface provides the movie data, which includes various fields describing a movie
    id: number;
    title: string;
    overview: string;
    poster_path: string | null; // some movies might not have a poster
    backdrop_path: string | null; // ^^ or a backdrop image
    release_date: string;
    vote_average: number;
    vote_count: number;
    runtime: number;
    tagline: string;
    genres: Genre[]; // some movies can have multiple genres
    credits?: Credits; // adding the ? after credits, makes this field optional. 
}

export interface MovieResponse { // represents entire response object from api when we put in a search request for the movie
    results: Movie[]; // array of movie objects, movie list that we will display on the client interface
    total_pages: number; // how many pages exist for this search
    total_results: number; // total number of movies that matched this search
    page: number; // current page number of the search results
}

