import { TestBed, inject } from '@angular/core/testing';

import { GenerateScenarioService } from './generate-scenario.service';

describe('GenerateScenarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerateScenarioService]
    });
  });

  it('should be created', inject([GenerateScenarioService], (service: GenerateScenarioService) => {
    expect(service).toBeTruthy();
  }));
});
