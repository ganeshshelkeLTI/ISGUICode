import { TestBed, inject } from '@angular/core/testing';

import { RoleUserMappingServiceService } from './role-user-mapping-service.service';

describe('RoleUserMappingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleUserMappingServiceService]
    });
  });

  it('should be created', inject([RoleUserMappingServiceService], (service: RoleUserMappingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
