import { TestBed, inject } from '@angular/core/testing';

import { UnixServiceService } from './unix-service.service';

describe('UnixServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnixServiceService]
    });
  });

  it('should be created', inject([UnixServiceService], (service: UnixServiceService) => {
    expect(service).toBeTruthy();
  }));
});
