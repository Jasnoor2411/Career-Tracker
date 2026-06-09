import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from './features/auth/login/login';
import { JobForm } from './features/jobs/job-form/job-form';
import { JobList } from './features/jobs/job-list/job-list';
import { JobPage } from './features/jobs/pages/job-page/job-page';
import { authGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';

const loginRedirectGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? router.createUrlTree(['/jobs/list']) : true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'signup',
    component: Login,
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'jobs',
    component: JobPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: JobList,
      },
      {
        path: 'new',
        component: JobForm,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
