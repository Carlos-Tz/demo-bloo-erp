import { TestBed } from '@angular/core/testing';

import { ApiApplicationService } from './api-application.service';

describe('ApiApplicationService', () => {
  let service: ApiApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
