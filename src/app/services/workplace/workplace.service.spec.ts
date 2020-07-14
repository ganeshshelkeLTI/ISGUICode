import { TestBed, inject } from '@angular/core/testing';

import { WorkplaceService } from './workplace.service';

describe('WorkplaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkplaceService]
    });
  });

  it('should be created', inject([WorkplaceService], (service: WorkplaceService) => {
    expect(service).toBeTruthy();
  }));
});
