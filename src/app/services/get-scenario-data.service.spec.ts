import { TestBed, inject } from '@angular/core/testing';

import { GetScenarioDataService } from './get-scenario-data.service';

describe('GetScenarioDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetScenarioDataService]
    });
  });

  it('should be created', inject([GetScenarioDataService], (service: GetScenarioDataService) => {
    expect(service).toBeTruthy();
  }));
});
