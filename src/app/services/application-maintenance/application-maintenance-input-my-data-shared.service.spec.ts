import { TestBed, inject } from '@angular/core/testing';

import { ApplicationMaintenanceInputMyDataSharedService } from './application-maintenance-input-my-data-shared.service';

describe('ApplicationMaintenanceInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationMaintenanceInputMyDataSharedService]
    });
  });

  it('should be created', inject([ApplicationMaintenanceInputMyDataSharedService], (service: ApplicationMaintenanceInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
