import { TestBed, inject } from '@angular/core/testing';

import { MainframelandingService } from './mainframelanding.service';

describe('MainframelandingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainframelandingService]
    });
  });

  it('should be created', inject([MainframelandingService], (service: MainframelandingService) => {
    expect(service).toBeTruthy();
  }));
});
