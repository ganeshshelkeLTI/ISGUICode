import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridApplicationMaintenanceComponent } from './compare-grid-application-maintenance.component';

describe('CompareGridApplicationMaintenanceComponent', () => {
  let component: CompareGridApplicationMaintenanceComponent;
  let fixture: ComponentFixture<CompareGridApplicationMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridApplicationMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridApplicationMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
