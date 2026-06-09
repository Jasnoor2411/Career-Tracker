import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './jobs.reducer';

export const selectJobsState = createFeatureSelector<State>('jobs');

export const selectAllJobs = createSelector(
  selectJobsState,
  (state) => state.jobs
);