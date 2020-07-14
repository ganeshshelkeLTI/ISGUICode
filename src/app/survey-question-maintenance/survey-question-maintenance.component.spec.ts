import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionMaintenanceComponent } from './survey-question-maintenance.component';

describe('SurveyQuestionMaintenanceComponent', () => {
  let component: SurveyQuestionMaintenanceComponent;
  let fixture: ComponentFixture<SurveyQuestionMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyQuestionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyQuestionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
