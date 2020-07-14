import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMaintenanceComponent } from './kpi-maintenance.component';

describe('KpiMaintenanceComponent', () => {
  let component: KpiMaintenanceComponent;
  let fixture: ComponentFixture<KpiMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
