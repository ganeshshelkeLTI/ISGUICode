import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataVoiceComponent } from './enter-my-data-voice.component';

describe('EnterMyDataVoiceComponent', () => {
  let component: EnterMyDataVoiceComponent;
  let fixture: ComponentFixture<EnterMyDataVoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataVoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
