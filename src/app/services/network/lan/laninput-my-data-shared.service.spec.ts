import { TestBed, inject } from '@angular/core/testing';

import { LANInputMyDataSharedService } from './laninput-my-data-shared.service';

describe('LANInputMyDataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LANInputMyDataSharedService]
    });
  });

  it('should be created', inject([LANInputMyDataSharedService], (service: LANInputMyDataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
