import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebLinkMasterComponent } from './web-link-master.component';

describe('WebLinkMasterComponent', () => {
  let component: WebLinkMasterComponent;
  let fixture: ComponentFixture<WebLinkMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebLinkMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebLinkMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
