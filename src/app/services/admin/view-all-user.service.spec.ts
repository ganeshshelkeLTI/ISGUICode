import { TestBed, inject } from '@angular/core/testing';

import { ViewAllUserService } from './view-all-user.service';

describe('ViewAllUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewAllUserService]
    });
  });

  it('should be created', inject([ViewAllUserService], (service: ViewAllUserService) => {
    expect(service).toBeTruthy();
  }));
});
