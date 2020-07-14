import { TestBed, inject } from '@angular/core/testing';

import { SurveyQuestionMaintenanceService } from './survey-question-maintenance.service';

describe('SurveyQuestionMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveyQuestionMaintenanceService]
    });
  });

  it('should be created', inject([SurveyQuestionMaintenanceService], (service: SurveyQuestionMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
