import { TestBed, inject } from '@angular/core/testing';

import { LoginDataBroadcastService } from './login-data-broadcast.service';

describe('LoginDataBroadcastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginDataBroadcastService]
    });
  });

  it('should be created', inject([LoginDataBroadcastService], (service: LoginDataBroadcastService) => {
    expect(service).toBeTruthy();
  }));
});
