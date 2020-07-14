import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationFailureComponent } from './authentication-failure.component';

describe('AuthenticationFailureComponent', () => {
  let component: AuthenticationFailureComponent;
  let fixture: ComponentFixture<AuthenticationFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationFailureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
