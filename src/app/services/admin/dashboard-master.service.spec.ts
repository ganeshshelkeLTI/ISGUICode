import { TestBed, inject } from '@angular/core/testing';

import { DashboardMasterService } from './dashboard-master.service';

describe('DashboardMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardMasterService]
    });
  });

  it('should be created', inject([DashboardMasterService], (service: DashboardMasterService) => {
    expect(service).toBeTruthy();
  }));
});
