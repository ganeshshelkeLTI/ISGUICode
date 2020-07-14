import { TestBed, inject } from '@angular/core/testing';

import { FeatureMasterService } from './feature-master.service';

describe('FeatureMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureMasterService]
    });
  });

  it('should be created', inject([FeatureMasterService], (service: FeatureMasterService) => {
    expect(service).toBeTruthy();
  }));
});
