import { TestBed, inject } from '@angular/core/testing';

import { UnixInputMyDataSharedService } from './unix-input-my-data-shared.service';

describe('UnixInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnixInputMyDataSharedService]
    });
  });

  it('should be created', inject([UnixInputMyDataSharedService], (service: UnixInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
