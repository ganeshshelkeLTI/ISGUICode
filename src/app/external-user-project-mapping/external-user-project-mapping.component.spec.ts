import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalUserProjectMapping } from './external-user-project-mapping.component';

describe('ExternalUserProjectMapping', () => {
  let component: ExternalUserProjectMapping;
  let fixture: ComponentFixture<ExternalUserProjectMapping>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalUserProjectMapping ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalUserProjectMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
