import { TestBed, inject } from '@angular/core/testing';

import { StorageInputMyDataSharedService } from './storage-input-my-data-shared.service';

describe('StorageInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageInputMyDataSharedService]
    });
  });

  it('should be created', inject([StorageInputMyDataSharedService], (service: StorageInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
