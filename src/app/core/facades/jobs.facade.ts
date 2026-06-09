import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Job } from '../models/job.module';

import * as Actions from '../../store/jobs.actions';
import * as Selectors from '../../store/jobs.selectors';

@Injectable({ providedIn: 'root' })
export class JobsFacade {
  store = inject(Store);
  editingJob = signal<Job | null>(null);

  // 📡 Streams (selectors exposed)
  jobs$ = this.store.select(Selectors.selectAllJobs);

  // 🚀 Commands (dispatch actions)
  load() {
    this.store.dispatch(Actions.loadJobs());
  }

  add(job: Job) {
    this.store.dispatch(Actions.addJob({ job }));
  }

  update(id: string, job: Job) {
    this.store.dispatch(Actions.updateJob({ id, job }));
  }

  delete(id: string) {
    this.store.dispatch(Actions.deleteJob({ id }));
  }

  startEditing(job: Job) {
    this.editingJob.set(job);
  }

  clearEditing() {
    this.editingJob.set(null);
  }
}
