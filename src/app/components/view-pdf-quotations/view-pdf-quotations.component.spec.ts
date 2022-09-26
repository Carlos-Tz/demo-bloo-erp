import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPdfQuotationsComponent } from './view-pdf-quotations.component';

describe('ViewPdfQuotationsComponent', () => {
  let component: ViewPdfQuotationsComponent;
  let fixture: ComponentFixture<ViewPdfQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPdfQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPdfQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
