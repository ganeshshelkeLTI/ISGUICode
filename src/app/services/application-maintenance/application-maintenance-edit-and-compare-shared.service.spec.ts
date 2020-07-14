import { TestBed, inject } from '@angular/core/testing';

import { ApplicationMaintenanceEditAndCompareSharedService } from './application-maintenance-edit-and-compare-shared.service';

describe('ApplicationMaintenanceEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationMaintenanceEditAndCompareSharedService]
    });
  });

  it('should be created', inject([ApplicationMaintenanceEditAndCompareSharedService], (service: ApplicationMaintenanceEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
