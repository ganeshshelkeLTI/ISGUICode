import { TestBed, inject } from '@angular/core/testing';

import { SiblingDataService } from './sibling-data.service';

describe('SiblingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiblingDataService]
    });
  });

  it('should be created', inject([SiblingDataService], (service: SiblingDataService) => {
    expect(service).toBeTruthy();
  }));
});
