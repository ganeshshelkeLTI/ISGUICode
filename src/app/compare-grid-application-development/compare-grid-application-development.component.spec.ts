import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridApplicationDevelopmentComponent } from './compare-grid-application-development.component';

describe('CompareGridApplicationDevelopmentComponent', () => {
  let component: CompareGridApplicationDevelopmentComponent;
  let fixture: ComponentFixture<CompareGridApplicationDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridApplicationDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridApplicationDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
