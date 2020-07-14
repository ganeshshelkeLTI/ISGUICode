import { TestBed, inject } from '@angular/core/testing';

import { VoiceEditAndCompareSharedService } from './voice-edit-and-compare-shared.service';

describe('VoiceEditAndCompareSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoiceEditAndCompareSharedService]
    });
  });

  it('should be created', inject([VoiceEditAndCompareSharedService], (service: VoiceEditAndCompareSharedService) => {
    expect(service).toBeTruthy();
  }));
});
