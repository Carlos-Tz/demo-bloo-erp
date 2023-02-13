import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEditNoteComponent } from './re-edit-note.component';

describe('ReEditNoteComponent', () => {
  let component: ReEditNoteComponent;
  let fixture: ComponentFixture<ReEditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReEditNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReEditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
