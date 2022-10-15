import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRequisitionsComponent } from './rejected-requisitions.component';

describe('RejectedRequisitionsComponent', () => {
  let component: RejectedRequisitionsComponent;
  let fixture: ComponentFixture<RejectedRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedRequisitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
