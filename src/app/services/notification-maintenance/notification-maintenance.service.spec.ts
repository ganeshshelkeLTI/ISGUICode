import { TestBed, inject } from '@angular/core/testing';

import { NotificationMaintenanceService } from './notification-maintenance.service';

describe('NotificationMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationMaintenanceService]
    });
  });

  it('should be created', inject([NotificationMaintenanceService], (service: NotificationMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
