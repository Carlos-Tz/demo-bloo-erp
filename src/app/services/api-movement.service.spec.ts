import { TestBed } from '@angular/core/testing';

import { ApiMovementService } from './api-movement.service';

describe('ApiMovementService', () => {
  let service: ApiMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
