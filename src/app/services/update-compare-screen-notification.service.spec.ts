import { TestBed, inject } from '@angular/core/testing';

import { UpdateCompareScreenNotificationService } from './update-compare-screen-notification.service';

describe('UpdateCompareScreenNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateCompareScreenNotificationService]
    });
  });

  it('should be created', inject([UpdateCompareScreenNotificationService], (service: UpdateCompareScreenNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
