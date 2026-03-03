import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { MovieDetailComponent } from './pages/movieDetail/movieDetail.component';

export const routes: Routes = 
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: '**', redirectTo: '' }
];


// this file routes the pages for the home page, search page, and the movie detail page. 
// angular will intercept the URL changes and will render the appropriate component based on the path (without reloading the page)

