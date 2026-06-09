import { createReducer, on } from '@ngrx/store';
import * as Actions from './jobs.actions';
import { Job } from '../core/models/job.module';

export interface State {
  jobs: Job[];
}

export const initialState: State = {
  jobs: []
};

export const jobsReducer = createReducer(
  initialState,

  on(Actions.loadJobsSuccess, (state, { jobs }) => ({
    ...state,
    jobs
  })),

  on(Actions.addJobSuccess, (state, { job }) => ({
    ...state,
    jobs: [...state.jobs, job]
  })),

  on(Actions.updateJobSuccess, (state, { job }) => ({
    ...state,
    jobs: state.jobs.map(j => j.id === job.id ? job : j)
  })),

  on(Actions.deleteJobSuccess, (state, { id }) => ({
    ...state,
    jobs: state.jobs.filter(j => j.id !== id)
  }))
);