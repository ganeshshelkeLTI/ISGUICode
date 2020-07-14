import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyValidationAdminComponent } from './survey-validation-admin.component';

describe('SurveyValidationAdminComponent', () => {
  let component: SurveyValidationAdminComponent;
  let fixture: ComponentFixture<SurveyValidationAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyValidationAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyValidationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
