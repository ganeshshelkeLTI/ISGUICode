import { TestBed, inject } from '@angular/core/testing';

import { ServicedeskService } from './servicedesk.service';

describe('ServicedeskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicedeskService]
    });
  });

  it('should be created', inject([ServicedeskService], (service: ServicedeskService) => {
    expect(service).toBeTruthy();
  }));
});
