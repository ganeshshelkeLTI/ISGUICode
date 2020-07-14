import { TestBed, inject } from '@angular/core/testing';

import { HeaderCompareEnterDataSharedService } from './header-compare-enter-data-shared.service';

describe('HeaderCompareEnterDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderCompareEnterDataSharedService]
    });
  });

  it('should be created', inject([HeaderCompareEnterDataSharedService], (service: HeaderCompareEnterDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
