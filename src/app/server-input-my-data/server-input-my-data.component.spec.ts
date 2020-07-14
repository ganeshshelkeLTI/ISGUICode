import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerInputMyDataComponent } from './server-input-my-data.component';

describe('ServerInputMyDataComponent', () => {
  let component: ServerInputMyDataComponent;
  let fixture: ComponentFixture<ServerInputMyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerInputMyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerInputMyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
