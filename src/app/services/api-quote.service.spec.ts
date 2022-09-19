import { TestBed } from '@angular/core/testing';

import { ApiQuoteService } from './api-quote.service';

describe('ApiQuoteService', () => {
  let service: ApiQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
