import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentNotificationComponent } from './deployment-notification.component';

describe('DeploymentNotificationComponent', () => {
  let component: DeploymentNotificationComponent;
  let fixture: ComponentFixture<DeploymentNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
