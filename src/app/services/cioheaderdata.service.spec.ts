import { TestBed, inject } from '@angular/core/testing';

import { CioheaderdataService } from './cioheaderdata.service';

describe('CioheaderdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CioheaderdataService]
    });
  });

  it('should be created', inject([CioheaderdataService], (service: CioheaderdataService) => {
    expect(service).toBeTruthy();
  }));
});
