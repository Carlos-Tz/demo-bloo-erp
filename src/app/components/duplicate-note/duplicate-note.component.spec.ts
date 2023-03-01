import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateNoteComponent } from './duplicate-note.component';

describe('DuplicateNoteComponent', () => {
  let component: DuplicateNoteComponent;
  let fixture: ComponentFixture<DuplicateNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
