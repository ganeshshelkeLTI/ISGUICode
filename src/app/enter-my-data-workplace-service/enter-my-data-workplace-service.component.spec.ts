import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataWorkplaceServiceComponent } from './enter-my-data-workplace-service.component';

describe('EnterMyDataWorkplaceServiceComponent', () => {
  let component: EnterMyDataWorkplaceServiceComponent;
  let fixture: ComponentFixture<EnterMyDataWorkplaceServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataWorkplaceServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataWorkplaceServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
