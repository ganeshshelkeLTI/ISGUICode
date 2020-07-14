import { TestBed, inject } from '@angular/core/testing';

import { ComparegridNetworkSharedService } from './comparegrid-network-shared.service';

describe('ComparegridNetworkSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridNetworkSharedService]
    });
  });

  it('should be created', inject([ComparegridNetworkSharedService], (service: ComparegridNetworkSharedService) => {
    expect(service).toBeTruthy();
  }));
});
