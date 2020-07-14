import { TestBed, inject } from '@angular/core/testing';

import { ApplicationDevelopmentService } from './application-development.service';

describe('ApplicationDevelopmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationDevelopmentService]
    });
  });

  it('should be created', inject([ApplicationDevelopmentService], (service: ApplicationDevelopmentService) => {
    expect(service).toBeTruthy();
  }));
});
