/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:unix-server.component.ts **/
/** Description:This file is created generate the line chart for all the tower's KPIs **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

declare var $:any;

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit {

	public data = [];
	public lineChartData: any;
	public lineChartId: any;
	//public currentyear:number;
	public colorArr:any;

  constructor() { }
  @Input() chartData:any;
  @Input() chartId: any;
  ngOnInit() {

	 this.lineChartData = this.chartData;
     this. lineChartId = this.chartId;
	 this.colorArr = ['#03abba','#9acb3b','#8b68c8', '#81cee4','#29497b','#8b68c8','#03abba'];



		//assign linechart as per data object format
		var tempData = [];

		var maxVal = 0;
		var minVal=0;

		//get currency symbol
		var currencySymbol = this.lineChartData.chart.numberprefix;


		this.lineChartData.dataset.forEach(function(key, val){

			var currentyear = Number((new Date()).getFullYear());


			var vals =[];

			// maxVal = key.data[0].value;
			var lengthYear = key.data.length;
			// console.log("lengthYear = "+lengthYear)
			if(lengthYear > 3){
				lengthYear = 3;
			}

			for(var i=0; i < lengthYear; i++)
			{
				
				var chartVal = Number(key.data[i].value).toFixed(0);
				vals.push({date: Number(currentyear-i), price :chartVal})
			}

			//find max val
			for(var i=0; i <key.data.length; i++)
			{
				for(var x=i;x<key.data.length;x++)
				{
					if(maxVal<key.data[x].value)
					{
						maxVal = key.data[x].value;
					}
				}
			}

			minVal = key.data[0].value;
			
			//find min val
			for(var i=0; i <key.data.length; i++)
			{
				for(var x=i;x<key.data.length;x++)
				{
					if(minVal>key.data[x].value)
					{
						minVal = key.data[x].value;
					}
				}
			}

			tempData.push({"name":key.seriesname,"values":vals});

		});


		this.data = tempData;



		var width = 700;
		var height = 400;
		var margin = 100;
		var duration = 250;

		var lineOpacity = "1";
		var lineOpacityHover = "0.85";
		var otherLinesOpacityHover = "1";
		var lineStroke = "3px";
		var lineStrokeHover = "3px";

		var circleOpacity = '1';
		var circleOpacityOnLineHover = "0.85"
		var circleRadius = 5;
		var circleRadiusHover = 5;


		/* Format Data */
		var parseDate = d3.timeParse("%Y");
		this.data.forEach(function(d) {
			d.values.forEach(function(d) {
				d.date = parseDate(d.date);
				d.price = +d.price;

			});
		});


		/* Scale */
		var xScale = d3.scaleTime()
			.domain(d3.extent(this.data[0].values, d => d.date))
			.range([0, width-margin]);

			
		var yScale = d3.scaleLinear()
			.domain([0, maxVal*1.5])
			.range([height-margin,0]);

		var color = d3.scaleOrdinal(['#03abba','#9acb3b','#8b68c8', '#81cee4','#29497b','#8b68c8','#03abba']);

		/* Add SVG */
		var svg = d3.select("#"+this.lineChartId).append("svg")
			.attr("width", (width+margin)+"px")
			.attr("height", (height+margin)+"px")
			.append('g')
			.attr("transform", `translate(${margin}, ${margin})`);


		/* Add line into SVG */
		var line = d3.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.price));

		let lines = svg.append('g')
			.attr('class', 'lines');



		lines.selectAll('.line-group')
			.data(this.data).enter()
			.append('g')
			.attr('class', 'line-group')
			.on("mouseover", function(d, i) {
					svg.append("text")
						.attr("class", "title-text")
						.style("fill", color(i))
						.text(d.name)
						.attr("text-anchor", "middle")
						.attr("x", (width-margin)/2)
						.attr("y", 5);
				})
			.on("mouseout", function(d) {
					svg.select(".title-text").remove();
				})
			.append('path')
			.attr('class', 'line')
			.attr('fill','none')
			.attr('d', d => line(d.values))
			.style('stroke', (d, i) => color(i))
			.style("stroke-width", lineStrokeHover)
			.style('opacity', lineOpacity)
			.on("mouseover", function(d) {
					d3.selectAll('.line')
							.style('opacity', otherLinesOpacityHover);
					d3.selectAll('.circle')
							.style('opacity', circleOpacityOnLineHover);
					d3.select(this)
						.style('opacity', lineOpacityHover)
						.style("stroke-width", lineStrokeHover)
						.style("cursor", "pointer");
				})
			.on("mouseout", function(d) {
					d3.selectAll(".line")
							.style('opacity', lineOpacity);
					d3.selectAll('.circle')
							.style('opacity', circleOpacity);
					d3.select(this)
						.style("stroke-width", lineStroke)
						.style("cursor", "none");
				});


		/* Add circles in the line */
		lines.selectAll("circle-group")
			.data(this.data).enter()
			.append("g")
			.style("fill", (d, i) => color(i))
			.selectAll("circle")
			.data(d => d.values).enter()
			.append("g")
			.attr("class", "circle")
			// .on("mouseover", function(d) {
			// 		d3.select(this)
			// 			.style("cursor", "pointer")
			// 			.append("text")
			// 			.attr("class", "text")
			// 			.text(`$${d.price}`)
			// 			.attr("x", d => xScale(d.date) + 5)
			// 			.attr("y", d => yScale(d.price) - 10);
			// 	})
			// .on("mouseout", function(d) {
			// 		d3.select(this)
			// 			.style("cursor", "none")
			// 			.transition()
			// 			.duration(duration)
			// 			.selectAll(".text").remove();
			// 	})
			.append("circle")
			.attr("cx", d => xScale(d.date))
			.attr("cy", d => yScale(d.price))
			.attr("r", circleRadius)
			.style('opacity', circleOpacity)

			.on("mouseover", function(d) {
						d3.select(this)
							.transition()
							.duration(duration)
							.attr("r", circleRadiusHover);
					})
				.on("mouseout", function(d) {
						d3.select(this)
							.transition()
							.duration(duration)
							.attr("r", circleRadius);
					});


			//added text here
			lines.selectAll(".circle")
			.append("text")
			.attr("class", "text")
			.text(d => (currencySymbol+''+d.price.toLocaleString()))
			.attr("x", d => xScale(d.date)+5)
			.attr("y", d => yScale(d.price)-10)
			.attr("fill", "#999")
				//end text here

			
		/* Add Axis into SVG */
		var xAxis = d3.axisBottom(xScale).ticks(4);
		var yAxis = d3.axisLeft(yScale).ticks(5);

		yAxis.tickFormat(function(d) {
			return currencySymbol + d.toLocaleString()
		});

	

		var xVal = 0;
		var yVal = 20;


		for(var i =0; i<this.data.length;i++)
	    {
			var tmp = svg.append("g")
			.attr("class", "line-chart-legend")
			.attr("transform", `translate(0, ${height-margin})`)
			.call(xAxis)
			.append("g");

			tmp.append('line')
      		.attr('x1', 160)
			.attr('y1', 50+(i*yVal))
			.attr("x2", 180)
			.attr("y2", 50+(i*yVal))
			.style('stroke', this.colorArr[i])
			.style('stroke-width', 5)
			.style("padding","50px");


			tmp.append('text')
			.attr("x", 200)
			.attr("y", 52+(i*yVal))
			.attr('text-anchor','start')
			.attr("fill", "#000")
			.text(this.data[i].name)

		}
		/*	svg.append("g")
			.attr("class", "line-chart-legend")
			.attr("transform", `translate(0, ${height-margin})`)
			.call(xAxis)
			.append('text')
			.attr("x", 230)
			.attr("y", 150)
			.attr("fill", "#000")
			.text(this.data[0].name);
		*/

		var legend = svg;
		var legendItemSize = 20.5;
		var legendSpacing = 2;




		/*svg.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${height-margin})`)
			.call(xAxis)
			.append('text')
			.attr("x", 230)
			.attr("y", 50)
			.attr("fill", "#000")
			.text(this.data[0].name);
		*/
		svg.append("g")
			.attr("class", "yaxis")
			.call(yAxis)
			.append('text');
			


			// .attr("y", 15)
			// .attr("transform", "rotate(-90)")
			// .attr("fill", "#000")
			// .text("Total values");


	}



}
