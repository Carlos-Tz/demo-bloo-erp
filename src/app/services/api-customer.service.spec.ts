import { TestBed } from '@angular/core/testing';

import { ApiCustomerService } from './api-customer.service';

describe('ApiCustomerService', () => {
  let service: ApiCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
