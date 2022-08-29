import { TestBed } from '@angular/core/testing';

import { ApiRanchService } from './api-ranch.service';

describe('ApiRanchService', () => {
  let service: ApiRanchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRanchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
