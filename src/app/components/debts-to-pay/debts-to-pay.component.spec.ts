import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsToPayComponent } from './debts-to-pay.component';

describe('DebtsToPayComponent', () => {
  let component: DebtsToPayComponent;
  let fixture: ComponentFixture<DebtsToPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtsToPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsToPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
