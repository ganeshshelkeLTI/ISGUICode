import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridComponent } from './compare-grid.component';

describe('CompareGridComponent', () => {
  let component: CompareGridComponent;
  let fixture: ComponentFixture<CompareGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
