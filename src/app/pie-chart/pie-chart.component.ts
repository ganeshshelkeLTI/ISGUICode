/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:pie-chart.component.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  106##### Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {



  constructor() { }


	@Input() chartWidth: number;
	@Input() chartHeight: number;
	@Input() chartID: number;
  @Input() thickness:number = 7;
  @Input() data:Object;
  @Input() chartData:any;

  ngOnInit() {
    var drillDowndata = [{
      label: "Network",
      value: "33"
    }, {
      label: "Workplace Services",
      value: "22"
    }, {
      label: "Data center",
      value: "21"
    }, {
      label: "Telecomunications",
      value: "19"
    }, {
      label: "Service Desk",
      value: "5"
    }]

    // console.log(this.data);

		  var width = this.chartWidth;
		  var height = this.chartHeight;
		  var chartId = this.chartID;
    var totalRadius = Math.min(width, height) / 2
    var donutHoleRadius = this.thickness;//totalRadius * 0.2;
    var chartData = this.chartData;
   // var donutHoleRadius = 27;


    var color = d3.scaleOrdinal(['#8b69c8', '#81cee4', '#9acb3b', '#03abba', '#29497b']);

    var svg = d3.select('#'+this.chartID).append('svg').attr('width', width).attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    var arc = d3.arc().innerRadius(totalRadius - donutHoleRadius).outerRadius(totalRadius)

    var pie = d3.pie()
      .value((d) => d.value)
      .sort(null)

    var path = svg
      .selectAll('path')
      .data(pie(chartData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('stroke', '#fff')
      .attr('stroke-width', "1")
      .attr('fill', (d, i) => color(d.data.label))

    var legendItemSize = 18
    var legendSpacing = 4



    var legend = svg
      .selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        var height = legendItemSize + legendSpacing
        var offset = height * color.domain().length / 2
        var x = legendItemSize * -2;
        var y = (i * height) - offset
        return `translate(${x}, ${y})`
      })

    // legend
    //   .append('rect')
    //   .attr('width', legendItemSize)
    //   .attr('height', legendItemSize)
    //   .style('fill', color);

    // legend
    //   .append('text')
    //   .attr('x', legendItemSize + legendSpacing)
    //   .attr('y', legendItemSize - legendSpacing)
    //   .text((d) => d)

  }

}
