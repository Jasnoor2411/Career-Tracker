import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { JobsFacade } from '../../../../core/facades/jobs.facade';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-job-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  standalone: true,
  templateUrl: './job-page.html',
  styleUrl: './job-page.css',
})
export class JobPage {
  constructor(
    private jobsFacade: JobsFacade,
    private router: Router,
    readonly authService: AuthService,
  ) {}

  startNewJob(): void {
    this.jobsFacade.clearEditing();
  }

  isAddPage(): boolean {
    return this.router.url.includes('/jobs/new');
  }

  logout(): void {
    this.jobsFacade.clearEditing();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
