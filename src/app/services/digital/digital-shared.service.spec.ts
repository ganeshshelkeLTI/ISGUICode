import { TestBed, inject } from '@angular/core/testing';

import { DigitalSharedService } from './digital-shared.service';

describe('DigitalSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DigitalSharedService]
    });
  });

  it('should be created', inject([DigitalSharedService], (service: DigitalSharedService) => {
    expect(service).toBeTruthy();
  }));
});
