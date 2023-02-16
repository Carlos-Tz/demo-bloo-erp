import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleChargeComponent } from './schedule-charge.component';

describe('ScheduleChargeComponent', () => {
  let component: ScheduleChargeComponent;
  let fixture: ComponentFixture<ScheduleChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
