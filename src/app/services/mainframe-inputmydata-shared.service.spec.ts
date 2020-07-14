import { TestBed, inject } from '@angular/core/testing';

import { MainframeInputmydataSharedService } from './mainframe-inputmydata-shared.service';

describe('MainframeInputmydataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainframeInputmydataSharedService]
    });
  });

  it('should be created', inject([MainframeInputmydataSharedService], (service: MainframeInputmydataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
