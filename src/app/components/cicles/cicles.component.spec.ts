import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiclesComponent } from './cicles.component';

describe('CiclesComponent', () => {
  let component: CiclesComponent;
  let fixture: ComponentFixture<CiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
