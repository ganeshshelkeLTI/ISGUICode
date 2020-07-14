import { TestBed, inject } from '@angular/core/testing';

import { PrivilegesService } from './privileges.service';

describe('PrivilegesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivilegesService]
    });
  });

  it('should be created', inject([PrivilegesService], (service: PrivilegesService) => {
    expect(service).toBeTruthy();
  }));
});
