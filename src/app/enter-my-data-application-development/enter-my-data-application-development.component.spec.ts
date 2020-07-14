import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataApplicationDevelopmentComponent } from './enter-my-data-application-development.component';

describe('EnterMyDataApplicationDevelopmentComponent', () => {
  let component: EnterMyDataApplicationDevelopmentComponent;
  let fixture: ComponentFixture<EnterMyDataApplicationDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataApplicationDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataApplicationDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
