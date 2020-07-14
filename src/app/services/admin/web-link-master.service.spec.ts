import { TestBed, inject } from '@angular/core/testing';

import { WebLinkMasterService } from './web-link-master.service';

describe('WebLinkMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebLinkMasterService]
    });
  });

  it('should be created', inject([WebLinkMasterService], (service: WebLinkMasterService) => {
    expect(service).toBeTruthy();
  }));
});
