import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsServersComponent } from './windows-servers.component';

describe('WindowsServersComponent', () => {
  let component: WindowsServersComponent;
  let fixture: ComponentFixture<WindowsServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowsServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
