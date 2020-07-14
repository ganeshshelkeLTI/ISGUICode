import { TestBed, inject } from '@angular/core/testing';

import { DropDownService } from './drop-down.service';

describe('DropDownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropDownService]
    });
  });

  it('should be created', inject([DropDownService], (service: DropDownService) => {
    expect(service).toBeTruthy();
  }));
});
