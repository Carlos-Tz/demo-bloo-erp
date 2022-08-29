import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RanchesComponent } from './ranches.component';

describe('RanchesComponent', () => {
  let component: RanchesComponent;
  let fixture: ComponentFixture<RanchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RanchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RanchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
