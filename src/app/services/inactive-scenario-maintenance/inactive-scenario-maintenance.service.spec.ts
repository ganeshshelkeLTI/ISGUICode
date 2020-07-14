import { TestBed, inject } from '@angular/core/testing';

import { InactiveScenarioMaintenanceService } from './inactive-scenario-maintenance.service';

describe('InactiveScenarioMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InactiveScenarioMaintenanceService]
    });
  });

  it('should be created', inject([InactiveScenarioMaintenanceService], (service: InactiveScenarioMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
