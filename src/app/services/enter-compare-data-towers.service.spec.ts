import { TestBed, inject } from '@angular/core/testing';

import { EnterCompareDataTowersService } from './enter-compare-data-towers.service';

describe('EnterCompareDataTowersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterCompareDataTowersService]
    });
  });

  it('should be created', inject([EnterCompareDataTowersService], (service: EnterCompareDataTowersService) => {
    expect(service).toBeTruthy();
  }));
});
