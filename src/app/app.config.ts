import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { jobsReducer } from './store/jobs.reducer';
import { JobsEffects } from './store/jobs.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: environment.appsync.graphqlUrl,
          headers: new HttpHeaders({
            'x-api-key': environment.appsync.apiKey,
          }),
        }),
        cache: new InMemoryCache({
          typePolicies: {
            Job: {
              keyFields: ['userId', 'jobId'],
            },
            User: {
              keyFields: ['userId'],
            },
          },
        }),
      };
    }),
    provideRouter(routes),
    provideStore({ jobs: jobsReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(JobsEffects),
  ],
};
