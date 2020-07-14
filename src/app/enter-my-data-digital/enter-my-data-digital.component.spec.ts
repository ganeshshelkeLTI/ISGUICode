import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataDigitalComponent } from './enter-my-data-digital.component';

describe('EnterMyDataDigitalComponent', () => {
  let component: EnterMyDataDigitalComponent;
  let fixture: ComponentFixture<EnterMyDataDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
