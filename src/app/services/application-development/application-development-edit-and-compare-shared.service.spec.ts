import { TestBed, inject } from '@angular/core/testing';

import { ApplicationDevelopmentEditAndCompareSharedService } from './application-development-edit-and-compare-shared.service';

describe('ApplicationDevelopmentEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationDevelopmentEditAndCompareSharedService]
    });
  });

  it('should be created', inject([ApplicationDevelopmentEditAndCompareSharedService], (service: ApplicationDevelopmentEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
