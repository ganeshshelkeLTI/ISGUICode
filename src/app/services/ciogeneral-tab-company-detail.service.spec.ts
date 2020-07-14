import { TestBed, inject } from '@angular/core/testing';

import { CIOGeneralTabCompanyDetailService } from './ciogeneral-tab-company-detail.service';

describe('CIOGeneralTabCompanyDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CIOGeneralTabCompanyDetailService]
    });
  });

  it('should be created', inject([CIOGeneralTabCompanyDetailService], (service: CIOGeneralTabCompanyDetailService) => {
    expect(service).toBeTruthy();
  }));
});
