import { TestBed, inject } from '@angular/core/testing';

import { EditAndCompareSharedService } from './edit-and-compare-shared.service';

describe('EditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditAndCompareSharedService]
    });
  });

  it('should be created', inject([EditAndCompareSharedService], (service: EditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
