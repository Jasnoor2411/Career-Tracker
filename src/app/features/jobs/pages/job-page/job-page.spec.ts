import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPage } from './job-page';

describe('JobPage', () => {
  let component: JobPage;
  let fixture: ComponentFixture<JobPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPage],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
