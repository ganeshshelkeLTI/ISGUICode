import { TestBed, inject } from '@angular/core/testing';

import { UnixEditAndCompareSharedService } from './unix-edit-and-compare-shared.service';

describe('UnixEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnixEditAndCompareSharedService]
    });
  });

  it('should be created', inject([UnixEditAndCompareSharedService], (service: UnixEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
