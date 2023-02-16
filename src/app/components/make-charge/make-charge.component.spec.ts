import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeChargeComponent } from './make-charge.component';

describe('MakeChargeComponent', () => {
  let component: MakeChargeComponent;
  let fixture: ComponentFixture<MakeChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
