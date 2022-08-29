import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCicleComponent } from './new-cicle.component';

describe('NewCicleComponent', () => {
  let component: NewCicleComponent;
  let fixture: ComponentFixture<NewCicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
