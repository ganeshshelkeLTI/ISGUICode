import { TestBed, inject } from '@angular/core/testing';

import { LinuxInputmydataSharedServiceService } from './linux-inputmydata-shared-service.service';

describe('LinuxInputmydataSharedServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinuxInputmydataSharedServiceService]
    });
  });

  it('should be created', inject([LinuxInputmydataSharedServiceService], (service: LinuxInputmydataSharedServiceService) => {
    expect(service).toBeTruthy();
  }));
});
