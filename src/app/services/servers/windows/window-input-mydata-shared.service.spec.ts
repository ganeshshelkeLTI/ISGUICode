import { TestBed, inject } from '@angular/core/testing';

import { WindowInputMydataSharedService } from './window-input-mydata-shared.service';

describe('WindowInputMydataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowInputMydataSharedService]
    });
  });

  it('should be created', inject([WindowInputMydataSharedService], (service: WindowInputMydataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
