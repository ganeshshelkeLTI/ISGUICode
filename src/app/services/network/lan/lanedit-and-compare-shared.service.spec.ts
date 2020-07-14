import { TestBed, inject } from '@angular/core/testing';

import { LANEditAndCompareSharedService } from './lanedit-and-compare-shared.service';

describe('LANEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LANEditAndCompareSharedService]
    });
  });

  it('should be created', inject([LANEditAndCompareSharedService], (service: LANEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
