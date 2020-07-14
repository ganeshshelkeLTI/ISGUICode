import { TestBed, inject } from '@angular/core/testing';

import { KpiDataCalculationService } from './kpi-data-calculation.service';

describe('KpiDataCalculationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KpiDataCalculationService]
    });
  });

  it('should be created', inject([KpiDataCalculationService], (service: KpiDataCalculationService) => {
    expect(service).toBeTruthy();
  }));
});
