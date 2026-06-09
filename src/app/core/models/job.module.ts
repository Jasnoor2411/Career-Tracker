export interface Job {
  id?: string;
  userId?: string;
  companyName: string;
  role: string;
  jd: string;
  package: number | null;
  status: 'TO_APPLY' | 'APPLIED' | 'INTERVIEW_PENDING';
  interviewDate?: string | null;
  isRemote: boolean;
}
