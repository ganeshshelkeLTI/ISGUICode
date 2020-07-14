import { TestBed, inject } from '@angular/core/testing';

import { DashboardFeatureMappingService } from './dashboard-feature-mapping.service';

describe('DashboardFeatureMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardFeatureMappingService]
    });
  });

  it('should be created', inject([DashboardFeatureMappingService], (service: DashboardFeatureMappingService) => {
    expect(service).toBeTruthy();
  }));
});
