import { TestBed, inject } from '@angular/core/testing';

import { WorkplaceEditAndCompareSharedService } from './workplace-edit-and-compare-shared.service';

describe('WorkplaceEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkplaceEditAndCompareSharedService]
    });
  });

  it('should be created', inject([WorkplaceEditAndCompareSharedService], (service: WorkplaceEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
