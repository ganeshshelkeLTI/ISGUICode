import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridServiceDeskComponent } from './compare-grid-service-desk.component';

describe('CompareGridServiceDeskComponent', () => {
  let component: CompareGridServiceDeskComponent;
  let fixture: ComponentFixture<CompareGridServiceDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridServiceDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridServiceDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
