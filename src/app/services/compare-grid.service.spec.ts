import { TestBed, inject } from '@angular/core/testing';

import { CompareGridService } from './compare-grid.service';

describe('CompareGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompareGridService]
    });
  });

  it('should be created', inject([CompareGridService], (service: CompareGridService) => {
    expect(service).toBeTruthy();
  }));
});
