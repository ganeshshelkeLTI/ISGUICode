import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataLANComponent } from './enter-my-data-lan.component';

describe('EnterMyDataLANComponent', () => {
  let component: EnterMyDataLANComponent;
  let fixture: ComponentFixture<EnterMyDataLANComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataLANComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataLANComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
