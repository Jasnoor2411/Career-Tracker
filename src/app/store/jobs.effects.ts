import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { JobService } from '../core/services/job.service';
import * as ActionsSet from './jobs.actions';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class JobsEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(JobService);

  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsSet.loadJobs),
      switchMap(() =>
        this.service.getJobs().pipe(
          map(jobs => ActionsSet.loadJobsSuccess({ jobs }))
        )
      )
    )
  );

  addJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsSet.addJob),
      switchMap(({ job }) =>
        this.service.addJob(job).pipe(
          map(newJob => ActionsSet.addJobSuccess({ job: newJob }))
        )
      )
    )
  );

  updateJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsSet.updateJob),
      switchMap(({ id, job }) =>
        this.service.updateJob(id, job).pipe(
          map(updated => ActionsSet.updateJobSuccess({ job: updated }))
        )
      )
    )
  );

  deleteJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsSet.deleteJob),
      switchMap(({ id }) =>
        this.service.deleteJob(id).pipe(
          map(() => ActionsSet.deleteJobSuccess({ id }))
        )
      )
    )
  );
}
