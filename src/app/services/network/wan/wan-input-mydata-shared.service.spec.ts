import { TestBed, inject } from '@angular/core/testing';

import { WanInputMydataSharedService } from './wan-input-mydata-shared.service';

describe('WanInputMydataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WanInputMydataSharedService]
    });
  });

  it('should be created', inject([WanInputMydataSharedService], (service: WanInputMydataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
