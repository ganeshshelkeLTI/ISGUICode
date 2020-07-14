import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataWindowsComponent } from './enter-my-data-windows.component';

describe('EnterMyDataWindowsComponent', () => {
  let component: EnterMyDataWindowsComponent;
  let fixture: ComponentFixture<EnterMyDataWindowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataWindowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
