import { TestBed, inject } from '@angular/core/testing';

import { ComparegridServicedeskSharedService } from './comparegrid-servicedesk-shared.service';

describe('ComparegridServicedeskSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridServicedeskSharedService]
    });
  });

  it('should be created', inject([ComparegridServicedeskSharedService], (service: ComparegridServicedeskSharedService) => {
    expect(service).toBeTruthy();
  }));
});
