import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsReportComponent } from './applications-report.component';

describe('ApplicationsReportComponent', () => {
  let component: ApplicationsReportComponent;
  let fixture: ComponentFixture<ApplicationsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
