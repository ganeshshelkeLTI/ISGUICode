import { TestBed, inject } from '@angular/core/testing';

import { MainframeEditAndCompareSharedService } from './mainframe-edit-and-compare-shared.service';

describe('MainframeEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainframeEditAndCompareSharedService]
    });
  });

  it('should be created', inject([MainframeEditAndCompareSharedService], (service: MainframeEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
