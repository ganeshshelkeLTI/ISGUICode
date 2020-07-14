import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridTowersComponent } from './compare-grid-towers.component';

describe('CompareGridTowersComponent', () => {
  let component: CompareGridTowersComponent;
  let fixture: ComponentFixture<CompareGridTowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridTowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridTowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
