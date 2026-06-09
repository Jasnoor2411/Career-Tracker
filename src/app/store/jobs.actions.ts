import { createAction, props } from '@ngrx/store';
import { Job } from '../core/models/job.module';

export const loadJobs = createAction('[Jobs] Load Jobs');
export const loadJobsSuccess = createAction('[Jobs] Load Jobs Success', props<{ jobs: Job[] }>());

export const addJob = createAction('[Jobs] Add Job', props<{ job: Job }>());
export const addJobSuccess = createAction('[Jobs] Add Job Success', props<{ job: Job }>());

export const updateJob = createAction('[Jobs] Update Job', props<{ id: string; job: Job }>());
export const updateJobSuccess = createAction('[Jobs] Update Job Success', props<{ job: Job }>());

export const deleteJob = createAction('[Jobs] Delete Job', props<{ id: string }>());
export const deleteJobSuccess = createAction('[Jobs] Delete Job Success', props<{ id: string }>());
