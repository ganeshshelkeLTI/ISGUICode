import { TestBed, inject } from '@angular/core/testing';

import { AdmGeneraltabService } from './adm-generaltab.service';

describe('AdmGeneraltabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdmGeneraltabService]
    });
  });

  it('should be created', inject([AdmGeneraltabService], (service: AdmGeneraltabService) => {
    expect(service).toBeTruthy();
  }));
});
