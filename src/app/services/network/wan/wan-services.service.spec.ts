import { TestBed, inject } from '@angular/core/testing';

import { WanServicesService } from './wan-services.service';

describe('WanServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WanServicesService]
    });
  });

  it('should be created', inject([WanServicesService], (service: WanServicesService) => {
    expect(service).toBeTruthy();
  }));
});
