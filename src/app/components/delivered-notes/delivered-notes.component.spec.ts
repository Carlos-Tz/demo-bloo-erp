import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredNotesComponent } from './delivered-notes.component';

describe('DeliveredNotesComponent', () => {
  let component: DeliveredNotesComponent;
  let fixture: ComponentFixture<DeliveredNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveredNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveredNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
