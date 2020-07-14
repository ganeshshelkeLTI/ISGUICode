import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDashboardMappingComponent } from './role-dashboard-mapping.component';

describe('RoleDashboardMappingComponent', () => {
  let component: RoleDashboardMappingComponent;
  let fixture: ComponentFixture<RoleDashboardMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleDashboardMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDashboardMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
