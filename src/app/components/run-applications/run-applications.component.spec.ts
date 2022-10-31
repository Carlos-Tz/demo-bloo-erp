import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunApplicationsComponent } from './run-applications.component';

describe('RunApplicationsComponent', () => {
  let component: RunApplicationsComponent;
  let fixture: ComponentFixture<RunApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
