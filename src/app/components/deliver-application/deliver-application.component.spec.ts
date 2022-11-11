import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverApplicationComponent } from './deliver-application.component';

describe('DeliverApplicationComponent', () => {
  let component: DeliverApplicationComponent;
  let fixture: ComponentFixture<DeliverApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
