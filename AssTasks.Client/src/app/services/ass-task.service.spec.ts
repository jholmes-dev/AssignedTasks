import { TestBed } from '@angular/core/testing';

import { AssTaskService } from './ass-task.service';

describe('TaskService', () => {
  let service: AssTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
