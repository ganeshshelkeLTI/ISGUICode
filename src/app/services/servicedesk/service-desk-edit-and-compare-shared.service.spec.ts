import { TestBed, inject } from '@angular/core/testing';

import { ServiceDeskEditAndCompareSharedService } from './service-desk-edit-and-compare-shared.service';

describe('ServiceDeskEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceDeskEditAndCompareSharedService]
    });
  });

  it('should be created', inject([ServiceDeskEditAndCompareSharedService], (service: ServiceDeskEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
