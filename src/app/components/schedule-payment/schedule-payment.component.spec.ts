import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePaymentComponent } from './schedule-payment.component';

describe('SchedulePaymentComponent', () => {
  let component: SchedulePaymentComponent;
  let fixture: ComponentFixture<SchedulePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
