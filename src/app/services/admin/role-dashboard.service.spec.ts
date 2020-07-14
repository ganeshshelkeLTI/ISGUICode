import { TestBed, inject } from '@angular/core/testing';

import { RoleDashboardService } from './role-dashboard.service';

describe('RoleDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleDashboardService]
    });
  });

  it('should be created', inject([RoleDashboardService], (service: RoleDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
