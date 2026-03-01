import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <div class="nav-brand">🎬 Movie Browser</div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/search" routerLinkActive="active">Search</a>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #1a1a2e;
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    .nav-brand { font-size: 1.4rem; font-weight: bold; }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      margin-left: 1.5rem;
      font-size: 1rem;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #e94560; }
    main { padding: 2rem; background: #16213e; min-height: 100vh; }
  `]
})
export class AppComponent {}