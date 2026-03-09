import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <div class="logo">TaskFlow</div>

      <nav class="nav">
        <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>

        <span class="user">welcome, {{ username }}</span>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </nav>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: #111827;
        color: white;
      }

      .logo {
        font-size: 2rem;
        font-weight: bold;
      }

      .nav {
        display: flex;
        align-items: center;
      }

      .nav a {
        margin-left: 2rem;
        text-decoration: none;
        color: #9ca3af;
        font-weight: 600;
      }

      .nav a.active {
        color: white;
        border-bottom: 2px solid #3b82f6;
      }

      .nav a:hover {
        color: white;
      }

      .logout-btn {
        margin-left: 2rem;
        padding: 8px 14px;
        border-radius: 6px;
        border: none;
        background: #ef4444;
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: 0.2s;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;

        background: linear-gradient(90deg, #0f172a, #1e293b);
        color: white;

        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }
      .user {
        margin-left: 2rem;
        font-weight: 600;
        color: #e5e7eb;
      }

      .logout-btn:hover {
        background: #dc2626;
      }

      .container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
    `,
  ],
})
export class LayoutComponent {
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
