import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainframeDrillDownDonutChartComponent } from './mainframe-drill-down-donut-chart.component';

describe('MainframeDrillDownDonutChartComponent', () => {
  let component: MainframeDrillDownDonutChartComponent;
  let fixture: ComponentFixture<MainframeDrillDownDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainframeDrillDownDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainframeDrillDownDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
