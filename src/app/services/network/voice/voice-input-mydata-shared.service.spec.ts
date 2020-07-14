import { TestBed, inject } from '@angular/core/testing';

import { VoiceInputMydataSharedService } from './voice-input-mydata-shared.service';

describe('VoiceInputMydataSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoiceInputMydataSharedService]
    });
  });

  it('should be created', inject([VoiceInputMydataSharedService], (service: VoiceInputMydataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
