import { TestBed } from '@angular/core/testing';

import { ApiNoteService } from './api-note.service';

describe('ApiNoteService', () => {
  let service: ApiNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
