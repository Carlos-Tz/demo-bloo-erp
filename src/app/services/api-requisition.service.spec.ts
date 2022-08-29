import { TestBed } from '@angular/core/testing';

import { ApiRequisitionService } from './api-requisition.service';

describe('ApiRequisitionService', () => {
  let service: ApiRequisitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRequisitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
