import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinuxServersComponent } from './linux-servers.component';

describe('LinuxServersComponent', () => {
  let component: LinuxServersComponent;
  let fixture: ComponentFixture<LinuxServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinuxServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinuxServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
