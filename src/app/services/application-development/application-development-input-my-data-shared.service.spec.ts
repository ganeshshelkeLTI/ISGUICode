import { TestBed, inject } from '@angular/core/testing';

import { ApplicationDevelopmentInputMyDataSharedService } from './application-development-input-my-data-shared.service';

describe('ApplicationDevelopmentInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationDevelopmentInputMyDataSharedService]
    });
  });

  it('should be created', inject([ApplicationDevelopmentInputMyDataSharedService], (service: ApplicationDevelopmentInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
