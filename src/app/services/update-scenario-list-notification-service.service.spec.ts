import { TestBed, inject } from '@angular/core/testing';

import { UpdateScenarioListNotificationServiceService } from './update-scenario-list-notification-service.service';

describe('UpdateScenarioListNotificationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateScenarioListNotificationServiceService]
    });
  });

  it('should be created', inject([UpdateScenarioListNotificationServiceService], (service: UpdateScenarioListNotificationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
