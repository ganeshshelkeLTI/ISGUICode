import { TestBed, inject } from '@angular/core/testing';

import { ComparegridApplicationMaintenanceService } from './comparegrid-application-maintenance.service';

describe('ComparegridApplicationMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridApplicationMaintenanceService]
    });
  });

  it('should be created', inject([ComparegridApplicationMaintenanceService], (service: ComparegridApplicationMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
