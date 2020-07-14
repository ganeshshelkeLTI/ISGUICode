import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReferenceMaintenanceComponent } from './custom-reference-maintenance.component';

describe('CustomReferenceMaintenanceComponent', () => {
  let component: CustomReferenceMaintenanceComponent;
  let fixture: ComponentFixture<CustomReferenceMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomReferenceMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReferenceMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
