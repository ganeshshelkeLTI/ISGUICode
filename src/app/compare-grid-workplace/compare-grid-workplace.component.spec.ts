import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridWorkplaceComponent } from './compare-grid-workplace.component';

describe('CompareGridWorkplaceComponent', () => {
  let component: CompareGridWorkplaceComponent;
  let fixture: ComponentFixture<CompareGridWorkplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridWorkplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
