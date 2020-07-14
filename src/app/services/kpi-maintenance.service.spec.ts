import { TestBed, inject } from '@angular/core/testing';

import { KpiMaintenanceService } from './kpi-maintenance.service';

describe('KpiMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpiMaintenanceService]
    });
  });

  it('should be created', inject([KpiMaintenanceService], (service: KpiMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
