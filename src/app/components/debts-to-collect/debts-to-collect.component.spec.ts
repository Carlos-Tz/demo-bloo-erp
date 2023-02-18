import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsToCollectComponent } from './debts-to-collect.component';

describe('DebtsToCollectComponent', () => {
  let component: DebtsToCollectComponent;
  let fixture: ComponentFixture<DebtsToCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtsToCollectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsToCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
