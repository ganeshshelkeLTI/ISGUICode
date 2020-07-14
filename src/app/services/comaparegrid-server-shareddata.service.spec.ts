import { TestBed, inject } from '@angular/core/testing';

import { ComaparegridServerShareddataService } from './comaparegrid-server-shareddata.service';

describe('ComaparegridServerShareddataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComaparegridServerShareddataService]
    });
  });

  it('should be created', inject([ComaparegridServerShareddataService], (service: ComaparegridServerShareddataService) => {
    expect(service).toBeTruthy();
  }));
});
