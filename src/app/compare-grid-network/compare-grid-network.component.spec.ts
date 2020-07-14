import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridNetworkComponent } from './compare-grid-network.component';

describe('CompareGridNetworkComponent', () => {
  let component: CompareGridNetworkComponent;
  let fixture: ComponentFixture<CompareGridNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
