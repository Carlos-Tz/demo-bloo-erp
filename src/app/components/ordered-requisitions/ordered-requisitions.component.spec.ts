import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedRequisitionsComponent } from './ordered-requisitions.component';

describe('OrderedRequisitionsComponent', () => {
  let component: OrderedRequisitionsComponent;
  let fixture: ComponentFixture<OrderedRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderedRequisitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderedRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
