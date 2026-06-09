import { Component, inject, OnInit } from '@angular/core';
import { Job } from '../../../core/models/job.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobsFacade } from '../../../core/facades/jobs.facade';
@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm implements OnInit {
  jobsFacade = inject(JobsFacade);
  selectedJob: Job | null = null;
  form = new FormGroup({
    companyName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    jd: new FormControl<string>('', {
      nonNullable: true,
    }),
    package: new FormControl<number | null>(null),

    status: new FormControl<Job['status']>('TO_APPLY', {
      nonNullable: true,
    }),
    interviewDate: new FormControl<string>(''),
    isRemote: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.selectedJob = this.jobsFacade.editingJob();

    if (this.selectedJob) {
      this.form.patchValue({
        companyName: this.selectedJob.companyName,
        role: this.selectedJob.role,
        jd: this.selectedJob.jd,
        package: this.selectedJob.package,
        status: this.selectedJob.status,
        interviewDate: this.selectedJob.interviewDate,
        isRemote: this.selectedJob.isRemote,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const jobData: Job = {
      ...this.form.getRawValue(),
    };

    if (this.selectedJob) {
      this.jobsFacade.update(
        this.selectedJob.id!,
        jobData,
      );
    } else {
      this.jobsFacade.add(jobData);
    }
    this.reset();
  }

  reset(): void {
    this.selectedJob = null;
    this.form.reset({
      companyName: '',
      role: '',
      jd: '',
      package: null,
      status: 'TO_APPLY',
      interviewDate: '',
      isRemote: false,
    });
    this.jobsFacade.clearEditing();
  }
}
