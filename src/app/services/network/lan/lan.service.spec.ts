import { TestBed, inject } from '@angular/core/testing';

import { LanService } from './lan.service';

describe('LanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanService]
    });
  });

  it('should be created', inject([LanService], (service: LanService) => {
    expect(service).toBeTruthy();
  }));
});
