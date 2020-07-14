import { TestBed, inject } from '@angular/core/testing';

import { TokenAuthenticationService } from './token-authentication.service';

describe('TokenAuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenAuthenticationService]
    });
  });

  it('should be created', inject([TokenAuthenticationService], (service: TokenAuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
