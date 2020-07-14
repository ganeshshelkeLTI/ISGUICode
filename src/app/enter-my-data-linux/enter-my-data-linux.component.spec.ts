import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataLinuxComponent } from './enter-my-data-linux.component';

describe('EnterMyDataLinuxComponent', () => {
  let component: EnterMyDataLinuxComponent;
  let fixture: ComponentFixture<EnterMyDataLinuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataLinuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataLinuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
