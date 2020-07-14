import { TestBed, inject } from '@angular/core/testing';

import { HeaderCompareScreenDataService } from './header-compare-screen-data.service';

describe('HeaderCompareScreenDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderCompareScreenDataService]
    });
  });

  it('should be created', inject([HeaderCompareScreenDataService], (service: HeaderCompareScreenDataService) => {
    expect(service).toBeTruthy();
  }));
});
