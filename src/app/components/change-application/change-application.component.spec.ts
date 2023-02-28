import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeApplicationComponent } from './change-application.component';

describe('ChangeApplicationComponent', () => {
  let component: ChangeApplicationComponent;
  let fixture: ComponentFixture<ChangeApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
