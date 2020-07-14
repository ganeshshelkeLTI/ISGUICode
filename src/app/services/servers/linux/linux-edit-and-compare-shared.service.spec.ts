import { TestBed, inject } from '@angular/core/testing';

import { LinuxEditAndCompareSharedService } from './linux-edit-and-compare-shared.service';

describe('LinuxEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinuxEditAndCompareSharedService]
    });
  });

  it('should be created', inject([LinuxEditAndCompareSharedService], (service: LinuxEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
