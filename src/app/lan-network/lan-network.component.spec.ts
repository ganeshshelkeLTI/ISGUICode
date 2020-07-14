import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanNetworkComponent } from './lan-network.component';

describe('LanNetworkComponent', () => {
  let component: LanNetworkComponent;
  let fixture: ComponentFixture<LanNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
