import { TestBed, inject } from '@angular/core/testing';

import { ComaparegridworkplaceSharedService } from './comaparegridworkplace-shared.service';

describe('ComaparegridworkplaceSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComaparegridworkplaceSharedService]
    });
  });

  it('should be created', inject([ComaparegridworkplaceSharedService], (service: ComaparegridworkplaceSharedService) => {
    expect(service).toBeTruthy();
  }));
});
