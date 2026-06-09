import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Job } from '../../../core/models/job.module';
import { JobsFacade } from '../../../core/facades/jobs.facade';

@Component({
  selector: 'app-job-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList implements OnInit {
  jobsFacade = inject(JobsFacade);
  router = inject(Router);

  jobs$ = this.jobsFacade.jobs$;
  searchControl = new FormControl('', { nonNullable: true });

  filteredJobs$ = combineLatest([
    this.jobs$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([jobs, query]) => {
      const term = query.trim().toLowerCase();

      if (!term) {
        return jobs;
      }

      return jobs.filter((job) => this.searchableJobText(job).includes(term));
    }),
  );

  ngOnInit(): void {
    this.jobsFacade.load();
  }

  deleteJob(id: string): void {
    this.jobsFacade.delete(id);
  }

  editJob(job: Job): void {
    this.jobsFacade.startEditing(job);
    void this.router.navigate(['/jobs/new']);
  }

  statusLabel(status: Job['status']): string {
    switch (status) {
      case 'APPLIED':
        return 'Applied';
      case 'INTERVIEW_PENDING':
        return 'Interviewing';
      default:
        return 'To Apply';
    }
  }

  getStatusClass(status: Job['status']): string {
    switch (status) {
      case 'APPLIED':
        return 'applied';
      case 'INTERVIEW_PENDING':
        return 'interview';
      default:
        return 'to-apply';
    }
  }

  private searchableJobText(job: Job): string {
    return [
      job.companyName,
      job.role,
      job.jd,
      job.status,
      this.statusLabel(job.status),
      job.isRemote ? 'Remote' : 'On-site',
      job.package?.toString(),
      job.interviewDate,
    ]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .toLowerCase();
  }
}
