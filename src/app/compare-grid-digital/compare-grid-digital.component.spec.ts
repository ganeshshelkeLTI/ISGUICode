import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridDigitalComponent } from './compare-grid-digital.component';

describe('CompareGridDigitalComponent', () => {
  let component: CompareGridDigitalComponent;
  let fixture: ComponentFixture<CompareGridDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
