import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmineducationComponent } from './admineducation.component';

describe('AdmineducationComponent', () => {
  let component: AdmineducationComponent;
  let fixture: ComponentFixture<AdmineducationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmineducationComponent]
    });
    fixture = TestBed.createComponent(AdmineducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
