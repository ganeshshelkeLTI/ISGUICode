import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveSurveyMaintenanceComponent } from './inactive-survey-maintenance.component';

describe('InactiveSurveyMaintenanceComponent', () => {
  let component: InactiveSurveyMaintenanceComponent;
  let fixture: ComponentFixture<InactiveSurveyMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveSurveyMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveSurveyMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
