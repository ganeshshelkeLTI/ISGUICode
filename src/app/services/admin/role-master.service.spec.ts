import { TestBed, inject } from '@angular/core/testing';

import { RoleMasterService } from './role-master.service';

describe('RoleMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleMasterService]
    });
  });

  it('should be created', inject([RoleMasterService], (service: RoleMasterService) => {
    expect(service).toBeTruthy();
  }));
});
