import { TestBed, inject } from '@angular/core/testing';

import { IndustrySizeService } from './industry-size.service';

describe('IndustrySizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndustrySizeService]
    });
  });

  it('should be created', inject([IndustrySizeService], (service: IndustrySizeService) => {
    expect(service).toBeTruthy();
  }));
});
