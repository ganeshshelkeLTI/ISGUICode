import { TestBed, inject } from '@angular/core/testing';

import { WanEditAndCompareSharedService } from './wan-edit-and-compare-shared.service';

describe('WanEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WanEditAndCompareSharedService]
    });
  });

  it('should be created', inject([WanEditAndCompareSharedService], (service: WanEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
