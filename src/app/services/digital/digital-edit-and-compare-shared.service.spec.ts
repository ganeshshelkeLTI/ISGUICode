import { TestBed, inject } from '@angular/core/testing';

import { DigitalEditAndCompareSharedService } from './digital-edit-and-compare-shared.service';

describe('DigitalEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DigitalEditAndCompareSharedService]
    });
  });

  it('should be created', inject([DigitalEditAndCompareSharedService], (service: DigitalEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
