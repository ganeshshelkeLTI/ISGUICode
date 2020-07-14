import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyValidationComponent } from './survey-validation.component';

describe('SurveyValidationComponent', () => {
  let component: SurveyValidationComponent;
  let fixture: ComponentFixture<SurveyValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
