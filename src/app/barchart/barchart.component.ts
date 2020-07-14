/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:barchart.component.ts **/
/** Description: This file is created to load barchart in Workplace tower **/
/** Created By: 10650513 Created Date: 28/09/2018 **/
/** Update By:  10650513 Update Date:  28/09/2018 **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
// import { ChartCIOSharedService } from '../services/chart-cioshared.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  constructor() { }
  @Input() chartData: any;
  @Input() chartID: any;
  @Input() chartHeight: any;

  ngOnChanges(changes) {
    var updateddataSet = this.chartData;
		this.updateBarChart(updateddataSet);
  }

  ngOnInit() {
    // this will remove old chart and create one
    var chartId = this.chartID;
    d3.select('#'+chartId).selectAll('svg').remove();
    this.createBarchart();
  }

  createBarchart() {
    var canvasHeight = 200;
    var dataSet = this.chartData;
    var chartId = this.chartID;
    canvasHeight = this.chartHeight;

    var heightRatio = d3.max(dataSet) / canvasHeight;

    var color = d3.scaleOrdinal(['','#81CDE4', '#29497A', '#5D6D7E']);

    var canvas = d3.select("#"+chartId)
    .append("svg").attr("width", "100%")
    .attr("height", canvasHeight + "px")

    var rectWidth = 100 / 5;
    var barPadding = rectWidth / 5;

    //Chart
    canvas.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect');

    canvas.selectAll('rect')
    .attr('x', function(d,i){return i*( rectWidth ) + '%';})
    .attr('y',  function(d){return canvasHeight;})
    .attr("height", function(d){return 0;})
    .attr("width", rectWidth - barPadding + '%')
    .attr("fill", color);

    //Animate the chart
    canvas.selectAll('rect')
    .transition().duration(3000)
    .attr('y',  function(d){return canvasHeight - d/heightRatio;})
    .attr("height", function(d){return d/heightRatio;});

    // Text
    canvas.selectAll('text')
    .data(dataSet)
    .enter()
    .append('text');

    canvas.selectAll('text')
    .attr('x', function(d,i){return i*( rectWidth ) + barPadding * 2   + '%';})
    .attr('y',  function(d){return canvasHeight - d/heightRatio + 15;})
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#fff")
    .text(function(d){return d;});
  }

  updateBarChart(dataSet) {
    // this will remove old chart and create one
    var chartId = this.chartID;
    d3.select('#'+chartId).selectAll('svg').remove();
    var canvasHeight = 200;
    canvasHeight = this.chartHeight;
    var dataSet = dataSet;
    var heightRatio = d3.max(dataSet) / canvasHeight;

    var color = d3.scaleOrdinal(['','#81CDE4', '#29497A', '#5D6D7E']);

    var canvas = d3.select("#"+chartId)
    .append("svg").attr("width", "100%")
    .attr("height", canvasHeight + "px")

    var rectWidth = 100 / 5;
    var barPadding = rectWidth / 5;

    //Chart
    canvas.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect');

    canvas.selectAll('rect')
    .attr('x', function(d,i){return i*( rectWidth ) + '%';})
    .attr('y',  function(d){return canvasHeight;})
    .attr("height", function(d){return 0;})
    .attr("width", rectWidth - barPadding + '%')
    .attr("fill", color);

    //Animate the chart
    canvas.selectAll('rect')
    .transition().duration(3000)
    .attr('y',  function(d){return canvasHeight - d/heightRatio;})
    .attr("height", function(d){return d/heightRatio;});

    // Text
    canvas.selectAll('text')
    .data(dataSet)
    .enter()
    .append('text');

    canvas.selectAll('text')
    .attr('x', function(d,i){return i*( rectWidth ) + barPadding * 2   + '%';})
    .attr('y',  function(d){return canvasHeight - d/heightRatio + 15;})
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#fff")
    .text(function(d){return d;});
  }

}
