import { TestBed, inject } from '@angular/core/testing';

import { SurveyValidationService } from './survey-validation.service';

describe('SurveyValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveyValidationService]
    });
  });

  it('should be created', inject([SurveyValidationService], (service: SurveyValidationService) => {
    expect(service).toBeTruthy();
  }));
});
