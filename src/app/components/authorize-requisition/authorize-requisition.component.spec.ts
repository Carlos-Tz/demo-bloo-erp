import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeRequisitionComponent } from './authorize-requisition.component';

describe('AuthorizeRequisitionComponent', () => {
  let component: AuthorizeRequisitionComponent;
  let fixture: ComponentFixture<AuthorizeRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeRequisitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
