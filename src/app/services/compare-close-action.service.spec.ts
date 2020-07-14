import { TestBed, inject } from '@angular/core/testing';

import { CompareCloseActionService } from './compare-close-action.service';

describe('CompareCloseActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompareCloseActionService]
    });
  });

  it('should be created', inject([CompareCloseActionService], (service: CompareCloseActionService) => {
    expect(service).toBeTruthy();
  }));
});
