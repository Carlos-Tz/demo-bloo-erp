import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRanchComponent } from './new-ranch.component';

describe('NewRanchComponent', () => {
  let component: NewRanchComponent;
  let fixture: ComponentFixture<NewRanchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRanchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRanchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
