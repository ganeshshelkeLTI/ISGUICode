import { TestBed, inject } from '@angular/core/testing';

import { ComparegridApplicationDevelopmentService } from './comparegrid-application-development.service';

describe('ComparegridApplicationDevelopmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparegridApplicationDevelopmentService]
    });
  });

  it('should be created', inject([ComparegridApplicationDevelopmentService], (service: ComparegridApplicationDevelopmentService) => {
    expect(service).toBeTruthy();
  }));
});
