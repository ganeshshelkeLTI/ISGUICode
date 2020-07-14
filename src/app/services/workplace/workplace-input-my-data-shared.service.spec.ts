import { TestBed, inject } from '@angular/core/testing';

import { WorkplaceInputMyDataSharedService } from './workplace-input-my-data-shared.service';

describe('WorkplaceInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkplaceInputMyDataSharedService]
    });
  });

  it('should be created', inject([WorkplaceInputMyDataSharedService], (service: WorkplaceInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
