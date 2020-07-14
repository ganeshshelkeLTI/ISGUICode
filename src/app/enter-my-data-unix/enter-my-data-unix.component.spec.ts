import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataUnixComponent } from './enter-my-data-unix.component';

describe('EnterMyDataUnixComponent', () => {
  let component: EnterMyDataUnixComponent;
  let fixture: ComponentFixture<EnterMyDataUnixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataUnixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataUnixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
