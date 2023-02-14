import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEditApplicationComponent } from './re-edit-application.component';

describe('ReEditApplicationComponent', () => {
  let component: ReEditApplicationComponent;
  let fixture: ComponentFixture<ReEditApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReEditApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReEditApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
