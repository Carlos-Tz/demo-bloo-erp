import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputNoteComponent } from './output-note.component';

describe('OutputNoteComponent', () => {
  let component: OutputNoteComponent;
  let fixture: ComponentFixture<OutputNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
