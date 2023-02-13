import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReNoteComponent } from './re-note.component';

describe('ReNoteComponent', () => {
  let component: ReNoteComponent;
  let fixture: ComponentFixture<ReNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
