import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WanNetworkComponent } from './wan-network.component';

describe('WanNetworkComponent', () => {
  let component: WanNetworkComponent;
  let fixture: ComponentFixture<WanNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WanNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WanNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
