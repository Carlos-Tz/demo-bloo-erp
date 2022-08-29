import { TestBed } from '@angular/core/testing';

import { ApiCicleService } from './api-cicle.service';

describe('ApiCicleService', () => {
  let service: ApiCicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
