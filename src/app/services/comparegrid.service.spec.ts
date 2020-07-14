import { TestBed, inject } from '@angular/core/testing';

import { ComparegridService } from './comparegrid.service';

describe('ComparegridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridService]
    });
  });

  it('should be created', inject([ComparegridService], (service: ComparegridService) => {
    expect(service).toBeTruthy();
  }));
});
