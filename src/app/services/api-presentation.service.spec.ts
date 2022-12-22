import { TestBed } from '@angular/core/testing';

import { ApiPresentationService } from './api-presentation.service';

describe('ApiPresentationService', () => {
  let service: ApiPresentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPresentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
