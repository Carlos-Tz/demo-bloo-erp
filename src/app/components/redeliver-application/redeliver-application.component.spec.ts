import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeliverApplicationComponent } from './redeliver-application.component';

describe('RedeliverApplicationComponent', () => {
  let component: RedeliverApplicationComponent;
  let fixture: ComponentFixture<RedeliverApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeliverApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeliverApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
