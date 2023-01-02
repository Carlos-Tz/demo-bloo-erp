import { TestBed } from '@angular/core/testing';

import { ApiCropService } from './api-crop.service';

describe('ApiCropService', () => {
  let service: ApiCropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
