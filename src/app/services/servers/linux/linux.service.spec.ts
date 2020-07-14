import { TestBed, inject } from '@angular/core/testing';

import { LinuxService } from './linux.service';

describe('LinuxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinuxService]
    });
  });

  it('should be created', inject([LinuxService], (service: LinuxService) => {
    expect(service).toBeTruthy();
  }));
});
