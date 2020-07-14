/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:drill-down-donut-chart.component.ts **/
/** Description: This file is created to generate the donut chart for CIO Dashboard **/
/** Created By: 10641278  Created Date: 28/09/2018 **/
/** Update By:  10641278  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
import {ChartCIOSharedService} from '../services/chart-cioshared.service';

import * as d3 from 'd3';

@Component({
  selector: 'drill-down-donut-chart',
  templateUrl: './drill-down-donut-chart.component.html',
  styleUrls: ['./drill-down-donut-chart.component.css']
})
export class DrillDownDonutChartComponent implements OnInit {

  constructor(private chartService:ChartCIOSharedService) {

  }


	@Input() chartWidth: number;
	@Input() chartHeight: number;
	@Input() chartID: number;
	@Input() fillColor:string;
  @Input() thickness:number = 7;
  @Input() chartData:any;

  ngOnInit() {

		var width = 1100;//this.chartWidth;
		var height = this.chartHeight;
		var chartId = this.chartID;
    var drillDowndata = this.chartData;
    var totalRadius = Math.min(width, height) / 2 - 30
    var donutHoleRadius = this.thickness;

    var formatDecimal = d3.format(",.1f");

    function format(number){
      return formatDecimal(number);
    }

    // var color = d3.scaleOrdinal(['#03abba','#9acb3b','#8b68c8', '#81cee4','#29497b']);
    // var color = d3.scaleOrdinal(['#03abba', '#9acb3b', '#8b68c8','#81cee4', '#908e8e', '#d668b6','#ff8a26','#ffc62c','#1db176', '#00759b','#c64e52', '#293e6b','#a0b0cc']);
    // var color = d3.scaleOrdinal(['#81cee3', '#03abb9', '#29487a','#9aca3a', '#6f6f6f', '#a98edc','#b4c1d8','#d8a2ac','#a7a7a7', '#26ceb8','#5288c7', '#c9e8ff','#d1df9c','#017487']);
    var color = d3.scaleOrdinal(['#78cbf1', '#0c9db9', '#284a87','#9dcf37', '#6a6a6a', '#ab8ee1','#b6bfdd','#facea7','#a8a8a8', '#6745a6','#4786cb']);

    var svg = d3.select('#'+chartId).append('svg').attr('width', width).attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 6}, ${height / 2})`)

    var arc = d3.arc().innerRadius(totalRadius - donutHoleRadius).outerRadius(totalRadius)

    var pie = d3.pie()
      .value((d) => d.value)
      .sort(null)

    var path = svg
      .selectAll('path')
      .data(pie(drillDowndata))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('stroke', '#fff')
      .attr('stroke-width', "1")
      .attr('fill', (d, i) => color(d.data.label))


      var g = svg.selectAll(".arc")
      .data(pie(drillDowndata))
      .enter().append("g");

    var legendItemSize = 15
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
        var x = legendItemSize * 10;// Will be right side of the donut chart.
        var y = ((i * (height+12)) - offset)-30// Still at the middle of the donut chart vertically.

        return `translate(${x}, ${y})`
      })

      g.append("text")
      .attr("transform", function(d) {
        var c = arc.centroid(d),
        xx = c[0],
        yy = c[1],
        h = Math.sqrt(xx*xx + yy*yy);
        // return "translate(" + c[0]*1.2 +"," + c[1]*1.2 + ")";
        return "translate(" + (xx/h * totalRadius)*1.2 +  ',' + (yy/h * totalRadius)*1.2 +  ")";
      })
      .attr("text-anchor", function(d) {
        return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
      })

      .attr("dy", ".35em")
      .style("fill","#494c50")
      .attr("class","donut-chart-drill-text")
      // .text(function(d) { return d.data.value+"%"; });
      .text(function(d) { return format(d.data.value)+"%"; });

     // legend.attr("transform","translate(0,20)")

    legend
      .append('rect')
      .attr('width', legendItemSize)
      .attr('height', legendItemSize)
      .attr("transform","translate(0,20)")
      .style("padding","50px")
      .style('fill', color);

    legend
      // .append('a')
      // .attr('href','assets/glossary/glossary.pdf')
      // .attr('target','_blank')
      .append('text')
      .style("padding","50px")
      .attr('x', legendItemSize + legendSpacing)
      .attr('y', legendItemSize - legendSpacing)
      .attr("transform","translate(0,20)")
      .attr("class","chartlegendText")
      // .style("text-decoration", "underline")
      .text((d) => d)

  }

}
