import { TestBed, inject } from '@angular/core/testing';

import { ComparegridDigitalService } from './comparegrid-digital.service';

describe('ComparegridDigitalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridDigitalService]
    });
  });

  it('should be created', inject([ComparegridDigitalService], (service: ComparegridDigitalService) => {
    expect(service).toBeTruthy();
  }));
});
