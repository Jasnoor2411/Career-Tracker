import { Injectable } from '@angular/core';
import { Job } from '../models/job.module';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

interface GraphQLJob {
  userId: string;
  jobId: string;
  companyName: string;
  role: string;
  jd: string;
  package: number | null;
  status: Job['status'];
  interviewDate?: string | null;
  isRemote: boolean;
}

interface ListJobsResponse {
  listJobs: GraphQLJob[];
}

interface CreateJobResponse {
  createJob: GraphQLJob;
}

interface UpdateJobResponse {
  updateJob: GraphQLJob;
}

const JOB_FIELDS = gql`
  fragment JobFields on Job {
    userId
    jobId
    companyName
    role
    jd
    package
    status
    interviewDate
    isRemote
  }
`;

const LIST_JOBS = gql`
  ${JOB_FIELDS}
  query ListJobs($userId: ID!) {
    listJobs(userId: $userId) {
      ...JobFields
    }
  }
`;

const CREATE_JOB = gql`
  ${JOB_FIELDS}
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      ...JobFields
    }
  }
`;

const UPDATE_JOB = gql`
  ${JOB_FIELDS}
  mutation UpdateJob($input: UpdateJobInput!) {
    updateJob(input: $input) {
      ...JobFields
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($userId: ID!, $jobId: ID!) {
    deleteJob(userId: $userId, jobId: $jobId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(
    private apollo: Apollo,
    private authService: AuthService,
  ) {}

  getJobs(): Observable<Job[]> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      return of([]);
    }

    return this.apollo
      .query<ListJobsResponse>({
        query: LIST_JOBS,
        variables: { userId },
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => (result.data?.listJobs ?? []).map((job) => this.fromGraphQLJob(job))));
  }

  addJob(job: Job): Observable<Job> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      return throwError(() => new Error('No logged in user.'));
    }

    return this.apollo
      .mutate<CreateJobResponse>({
        mutation: CREATE_JOB,
        variables: {
          input: this.toCreateJobInput(job, userId),
        },
      })
      .pipe(map((result) => this.fromGraphQLJob(result.data!.createJob)));
  }

  updateJob(id: string, job: Job): Observable<Job> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      return throwError(() => new Error('No logged in user.'));
    }

    return this.apollo
      .mutate<UpdateJobResponse>({
        mutation: UPDATE_JOB,
        variables: {
          input: {
            ...this.toCreateJobInput(job, userId),
            jobId: id,
          },
        },
      })
      .pipe(map((result) => this.fromGraphQLJob(result.data!.updateJob)));
  }

  deleteJob(id: string): Observable<void> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      return throwError(() => new Error('No logged in user.'));
    }

    return this.apollo
      .mutate({
        mutation: DELETE_JOB,
        variables: {
          userId,
          jobId: id,
        },
      })
      .pipe(map(() => undefined));
  }

  private toCreateJobInput(job: Job, userId: string) {
    return {
      userId,
      companyName: job.companyName,
      role: job.role,
      jd: job.jd,
      package: job.package,
      status: job.status,
      interviewDate: job.interviewDate || null,
      isRemote: job.isRemote,
    };
  }

  private fromGraphQLJob(job: GraphQLJob): Job {
    return {
      id: job.jobId,
      userId: job.userId,
      companyName: job.companyName,
      role: job.role,
      jd: job.jd,
      package: job.package,
      status: job.status,
      interviewDate: job.interviewDate ?? null,
      isRemote: job.isRemote,
    };
  }
}
