import { TestBed, inject } from '@angular/core/testing';

import { ExternalUserProjectMappingService } from './external-user-project-mapping.service';

describe('ExternalUserProjectMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalUserProjectMappingService]
    });
  });

  it('should be created', inject([ExternalUserProjectMappingService], (service: ExternalUserProjectMappingService) => {
    expect(service).toBeTruthy();
  }));
});
