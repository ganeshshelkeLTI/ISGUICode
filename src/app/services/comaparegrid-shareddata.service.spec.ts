import { TestBed, inject } from '@angular/core/testing';

import { ComaparegridShareddataService } from './comaparegrid-shareddata.service';

describe('ComaparegridShareddataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComaparegridShareddataService]
    });
  });

  it('should be created', inject([ComaparegridShareddataService], (service: ComaparegridShareddataService) => {
    expect(service).toBeTruthy();
  }));
});
