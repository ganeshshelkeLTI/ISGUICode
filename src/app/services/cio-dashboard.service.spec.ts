import { TestBed, inject } from '@angular/core/testing';

import { CioDashboardService } from './cio-dashboard.service';

describe('CioDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CioDashboardService]
    });
  });

  it('should be created', inject([CioDashboardService], (service: CioDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
