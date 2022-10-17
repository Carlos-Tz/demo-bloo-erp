import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidOrdersComponent } from './paid-orders.component';

describe('PaidOrdersComponent', () => {
  let component: PaidOrdersComponent;
  let fixture: ComponentFixture<PaidOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
