import { TestBed, inject } from '@angular/core/testing';

import { ApplicationMaintenanceService } from './application-maintenance.service';

describe('ApplicationMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationMaintenanceService]
    });
  });

  it('should be created', inject([ApplicationMaintenanceService], (service: ApplicationMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
