import { TestBed, inject } from '@angular/core/testing';

import { CompareeditWorkplaceShareddataService } from './compareedit-workplace-shareddata.service';

describe('CompareeditWorkplaceShareddataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompareeditWorkplaceShareddataService]
    });
  });

  it('should be created', inject([CompareeditWorkplaceShareddataService], (service: CompareeditWorkplaceShareddataService) => {
    expect(service).toBeTruthy();
  }));
});
