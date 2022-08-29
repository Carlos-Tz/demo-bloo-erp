import { TestBed } from '@angular/core/testing';

import { ApiCompanyService } from './api-company.service';

describe('ApiCompanyService', () => {
  let service: ApiCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
