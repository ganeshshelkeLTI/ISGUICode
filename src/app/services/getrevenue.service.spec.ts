import { TestBed, inject } from '@angular/core/testing';

import { GetrevenueService } from './getrevenue.service';

describe('GetrevenueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetrevenueService]
    });
  });

  it('should be created', inject([GetrevenueService], (service: GetrevenueService) => {
    expect(service).toBeTruthy();
  }));
});
