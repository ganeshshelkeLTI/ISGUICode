import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSurveyQuestionMaintenanceComponent } from './master-survey-question-maintenance.component';

describe('MasterSurveyQuestionMaintenanceComponent', () => {
  let component: MasterSurveyQuestionMaintenanceComponent;
  let fixture: ComponentFixture<MasterSurveyQuestionMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSurveyQuestionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSurveyQuestionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
