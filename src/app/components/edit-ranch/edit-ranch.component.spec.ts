import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRanchComponent } from './edit-ranch.component';

describe('EditRanchComponent', () => {
  let component: EditRanchComponent;
  let fixture: ComponentFixture<EditRanchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRanchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRanchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
