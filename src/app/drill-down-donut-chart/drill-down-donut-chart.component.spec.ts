import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillDownDonutChartComponent } from './drill-down-donut-chart.component';

describe('DrillDownDonutChartComponent', () => {
  let component: DrillDownDonutChartComponent;
  let fixture: ComponentFixture<DrillDownDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillDownDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
