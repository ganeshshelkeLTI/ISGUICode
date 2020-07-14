import { TestBed, inject } from '@angular/core/testing';

import { ChartCIOSharedService } from './chart-cioshared.service';

describe('ChartCIOSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartCIOSharedService]
    });
  });

  it('should be created', inject([ChartCIOSharedService], (service: ChartCIOSharedService) => {
    expect(service).toBeTruthy();
  }));
});
