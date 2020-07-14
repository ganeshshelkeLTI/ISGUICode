import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnixServersComponent } from './unix-servers.component';

describe('UnixServersComponent', () => {
  let component: UnixServersComponent;
  let fixture: ComponentFixture<UnixServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnixServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnixServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
