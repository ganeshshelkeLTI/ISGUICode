/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:mainframe-drill-down-donut-chart.component.ts **/
/** Description: This file is created to generate the donut chart for all the tower's KPIs except CIO Dashboard **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10651577  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
import {ChartCIOSharedService} from '../services/chart-cioshared.service';

import * as d3 from 'd3';

@Component({
  selector: 'mainframe-drill-down-donut-chart',
  templateUrl: './mainframe-drill-down-donut-chart.component.html',
  styleUrls: ['./mainframe-drill-down-donut-chart.component.css']
})
export class MainframeDrillDownDonutChartComponent implements OnInit {

  constructor(private chartService:ChartCIOSharedService) {

  }


	@Input() chartWidth: number;
	@Input() chartHeight: number;
	@Input() chartID: number;
	@Input() fillColor:string;
  @Input() thickness:number = 7;
  @Input() chartData:any;
  @Input() chartRadius:number;
  @Input() chartLegendSize:number;
  @Input() rotateTextFlg:boolean = false;



  ngOnInit() {

    // this.chartHeight = 315;

		var width = 1300;//this.chartWidth;
		var height = this.chartHeight;
		var chartId = this.chartID;
    var drillDowndata = this.chartData;
    var totalRadius = Math.min(width, height) / 2 - this.chartRadius
    var donutHoleRadius = this.thickness;
    var radius = 200;
    var rotateTextFlg = this.rotateTextFlg;

    var formatDecimal = d3.format(",.1f");

    function format(number){
      return formatDecimal(number);
    }

    function computeTextRotation(d) {
      var rotation = (d.startAngle + d.endAngle)/2 * 180 / Math.PI - 90;
      return {
        global: rotation,
        correction: rotation > 90 ? 180 : 0
      };
    }

    // var color = d3.scaleOrdinal(['#81CDE4', '#29497A', '#5D6D7E','#008080', '#000000', '#143333','#98CD37','#1B4F72','#8B69C8', '#EF5F00','#01ABBA', '#6495ed','#515A5A']);
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

    var legendItemSize = 20.5;
    var legendSpacing = 2;

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
      var y = ((i * (height+12)) - offset)-50// Still at the middle of the donut chart vertically.

      return `translate(${x}, ${y})`
    })

    g.append("text")
    .attr("transform", function(d) {
      if(rotateTextFlg) {
        // this will rotate the text
        var r = computeTextRotation(d);
        return "rotate(" + r.global + ")" + "translate(" + (radius + totalRadius) / 2 + ",0)" + "rotate(" + -r.correction + ")";
      } else {
        var c = arc.centroid(d),
        xx = c[0],
        yy = c[1],
        h = Math.sqrt(xx*xx + yy*yy);
        // // return "translate(" + c[0]*1.2 +"," + c[1]*1.2 + ")";
        return "translate(" + (xx/h * totalRadius)*1.2 +  ',' + (yy/h * totalRadius)*1.2 +  ")";
      }
      // var c = arc.centroid(d),
      // xx = c[0],
      // yy = c[1],
      // h = Math.sqrt(xx*xx + yy*yy);
      // // return "translate(" + c[0]*1.2 +"," + c[1]*1.2 + ")";
      // return "translate(" + (xx/h * totalRadius)*1.2 +  ',' + (yy/h * totalRadius)*1.2 +  ")";
    })
    .attr("text-anchor", function(d) {
      return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "end";
    })

    .attr("dy", ".35em")
    .attr("dx", "1.7em")
    .style("fill","#494c50")
    .attr("class","donut-chart-drill-text")
    // .text(function(d) { return format(Math.abs(d.data.value))+"%"; });
    .text(function(d) { return format(d.data.value)+"%"; });

    legend
    .append('rect')
    .attr('width', legendItemSize)
    .attr('height', legendItemSize)
    .attr("transform","translate(0,20)")
    .style("padding","50px")
    .style('fill', color);

    legend
    // .append('a')
    // .attr('href','assets/glossary/glossary.pdf') //provide glossary pdf
    // .attr('target','_blank')
    .append('text')
    .style("padding","50px")
    .attr('x', legendItemSize + legendSpacing)
    .attr('y', (legendItemSize - legendSpacing)-2.5)
    .attr("transform","translate(0,20)")
    .attr("class","chartlegendText")
    // .style("text-decoration", "underline")
    .text((d) => d)
  }

}
