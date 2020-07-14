import { TestBed, inject } from '@angular/core/testing';

import { WindowsEditAndCompareSharedService } from './windows-edit-and-compare-shared.service';

describe('WindowsEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowsEditAndCompareSharedService]
    });
  });

  it('should be created', inject([WindowsEditAndCompareSharedService], (service: WindowsEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
