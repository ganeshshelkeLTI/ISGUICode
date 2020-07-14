import { TestBed, inject } from '@angular/core/testing';

import { ComaparegridStorageSharedService } from './comaparegrid-storage-shared.service';

describe('ComaparegridStorageSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComaparegridStorageSharedService]
    });
  });

  it('should be created', inject([ComaparegridStorageSharedService], (service: ComaparegridStorageSharedService) => {
    expect(service).toBeTruthy();
  }));
});
