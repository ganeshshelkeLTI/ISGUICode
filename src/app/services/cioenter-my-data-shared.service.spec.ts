import { TestBed, inject } from '@angular/core/testing';

import { CIOEnterMyDataSharedService } from './cioenter-my-data-shared.service';

describe('CIOEnterMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CIOEnterMyDataSharedService]
    });
  });

  it('should be created', inject([CIOEnterMyDataSharedService], (service: CIOEnterMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
