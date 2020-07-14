import { TestBed, inject } from '@angular/core/testing';

import { StorageEditAndCompareSharedService } from './storage-edit-and-compare-shared.service';

describe('StorageEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageEditAndCompareSharedService]
    });
  });

  it('should be created', inject([StorageEditAndCompareSharedService], (service: StorageEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
