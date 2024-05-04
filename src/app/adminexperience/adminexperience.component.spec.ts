import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminexperienceComponent } from './adminexperience.component';

describe('AdminexperienceComponent', () => {
  let component: AdminexperienceComponent;
  let fixture: ComponentFixture<AdminexperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminexperienceComponent]
    });
    fixture = TestBed.createComponent(AdminexperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
