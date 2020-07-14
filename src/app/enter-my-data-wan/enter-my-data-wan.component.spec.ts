import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataWanComponent } from './enter-my-data-wan.component';

describe('EnterMyDataWanComponent', () => {
  let component: EnterMyDataWanComponent;
  let fixture: ComponentFixture<EnterMyDataWanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataWanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataWanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
