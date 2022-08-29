import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequisitionComponent } from './new-requisition.component';

describe('NewRequisitionComponent', () => {
  let component: NewRequisitionComponent;
  let fixture: ComponentFixture<NewRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRequisitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
