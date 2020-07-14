import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTowersDigitalComponent } from './compare-towers-digital.component';

describe('CompareTowersDigitalComponent', () => {
  let component: CompareTowersDigitalComponent;
  let fixture: ComponentFixture<CompareTowersDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareTowersDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareTowersDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
