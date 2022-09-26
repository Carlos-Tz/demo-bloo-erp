import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProviderComponent } from './assign-provider.component';

describe('AssignProviderComponent', () => {
  let component: AssignProviderComponent;
  let fixture: ComponentFixture<AssignProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
