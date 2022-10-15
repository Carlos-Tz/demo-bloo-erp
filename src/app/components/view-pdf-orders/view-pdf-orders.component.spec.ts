import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPdfOrdersComponent } from './view-pdf-orders.component';

describe('ViewPdfOrdersComponent', () => {
  let component: ViewPdfOrdersComponent;
  let fixture: ComponentFixture<ViewPdfOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPdfOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPdfOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
