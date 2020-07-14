import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceNetworkComponent } from './voice-network.component';

describe('VoiceNetworkComponent', () => {
  let component: VoiceNetworkComponent;
  let fixture: ComponentFixture<VoiceNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
