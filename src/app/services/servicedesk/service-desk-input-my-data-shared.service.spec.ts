import { TestBed, inject } from '@angular/core/testing';

import { ServiceDeskInputMyDataSharedService } from './service-desk-input-my-data-shared.service';

describe('ServiceDeskInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceDeskInputMyDataSharedService]
    });
  });

  it('should be created', inject([ServiceDeskInputMyDataSharedService], (service: ServiceDeskInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
