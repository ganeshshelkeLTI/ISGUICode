import { TestBed, inject } from '@angular/core/testing';

import { CustomRefGroupService } from './custom-ref-group.service';

describe('CustomRefGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomRefGroupService]
    });
  });

  it('should be created', inject([CustomRefGroupService], (service: CustomRefGroupService) => {
    expect(service).toBeTruthy();
  }));
});
