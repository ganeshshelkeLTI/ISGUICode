/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:donut-chart.component.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  106##### Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
	selector: 'app-donut-chart',
	templateUrl: './donut-chart.component.html',
	styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

	constructor() { }
	@Input() percentVal: number;
	@Input() chartWidth: number;
	@Input() chartHeight: number;
	@Input() chartID: number;
	@Input() fillColor:string;
	@Input() oneValue:number = 0;
	@Input() thickness:number = 7;

	
	ngOnChanges(changes) {
		//  console.log("in onchanges = "+this.percentVal)
		//  console.log(changes)
		var chartId = this.chartID;
		var updatedPercent = this.percentVal; 
		var updatedWidth = this.chartWidth; 
		var updatedHeight = this.chartHeight; 
		var filledColor = this.fillColor;
		var thicknessVal = this.thickness;
		this.updateDonut(chartId, updatedPercent, updatedWidth, updatedHeight, filledColor, thicknessVal);
	  }
	 
	ngOnInit() {
		this.createDonutChart();
	}
	
	createDonutChart(){

		
		if(this.oneValue == 1) {
			this.thickness == 35;
		}

		var duration = 1500,
		transition = 200,
		percent = this.percentVal;
		var width = this.chartWidth;
		var height = this.chartHeight;
		var chartId = this.chartID;
		var fillColor = this.fillColor;
		var thickness = this.thickness;
		var anglesRange = 2 * Math.PI;

		var dataset = {
			lower: calcPercent(0),
			upper: calcPercent(percent)
		},
		radius = Math.min(width, height) / 2;

		var colors;
		
		//for some of Digital donut charts, customization
		// if(String(this.chartID)=='digital-rev-last-2yrs' || String(this.chartID)=='digital-cust-retention-2yrs' || String(this.chartID)=='digital-operation-exp-2yrs')
		// {
		// 	colors = ["#"+fillColor , "#e2e3e4"]
		// }
		// else
		// {
			colors = ["#"+fillColor , "#e2e3e4"]
		//}
		
		var arc = d3.arc()
		.innerRadius(radius - thickness)
		.outerRadius(radius);

		var pie = d3.pie()
		.value(function(d) {
			return d;
		})
		.sort(null)
		.startAngle(anglesRange * -1)
		.endAngle(anglesRange);

		var svg = d3.select("#"+chartId).append("svg")
		.attr("width", width)
		.attr("name", chartId)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var path;

		
		// if(String(this.chartID)=='digital-rev-last-2yrs' || String(this.chartID)=='digital-cust-retention-2yrs' || String(this.chartID)=='digital-operation-exp-2yrs')
		// {
		// 	path = svg.selectAll("path")
		// .data(pie(dataset.lower))
		// .enter().append("path")
		// .attr('fill', '#e2e3e4')
		// .attr("d", arc)
		// .each(function(d) {
		// 	this._current = d;
		// });
			
		// }
		//else
		//{
			path = svg.selectAll("path")
		.data(pie(dataset.lower))
		.enter().append("path")
		.attr('fill', '#e2e3e4')
		.attr("d", arc)
		.each(function(d) {
			this._current = d;
		});

		//}


		var text = svg.append("text")
		.attr("text-anchor", "middle")
		.attr("dy", "1em")
		.attr("class","hide-text-donut");

		var progress = 0;
		var format = d3.format("0");

		var timeout;

		
		/*if(String(this.chartID)=='digital-rev-last-2yrs' || String(this.chartID)=='digital-cust-retention-2yrs' || String(this.chartID)=='digital-operation-exp-2yrs')
		{
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				path = path.data(pie(dataset.upper));
				path.transition().duration(duration).attrTween("d", function(a, index) {
					var self = this;
					var i = d3.interpolate(this._current, a);
					var i2 = d3.interpolateNumber(progress, percent)
					this._current = i(0);
					return function(t) {
						d3.select(self).attr('fill', index !== 0 ? '#e2e3e4' : i2(t) > 5 ? '#'+fillColor : '#'+fillColor);
						text.text(Math.round(i2(t)));
						return arc(i(t));
					};
				});
			}, 200);
		}
		else
		{*/
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				path = path.data(pie(dataset.upper));
				path.transition().duration(duration).attrTween("d", function(a, index) {
					var self = this;
					var i = d3.interpolate(this._current, a);
					var i2 = d3.interpolateNumber(progress, percent)
					this._current = i(0);
					return function(t) {
						d3.select(self).attr('fill', index !== 0 ? '#e2e3e4' : i2(t) > 5 ? '#'+fillColor : '#'+fillColor);
						text.text(Math.round(i2(t)));
						return arc(i(t));
					};
				});
			}, 200);
	
		//}


		function calcPercent(percent) {
			return [percent, 10 - percent];
		};

		



	}
	updateDonut(updateChartId, updatedPercent, updatedWidth, updatedHeight, filledColor, thicknessVal){
		// console.log("updateChartId = "+updateChartId+" updatedPercent =  "+updatedPercent+" thicknessVal = "+thicknessVal)
		var anglesRange = 2 * Math.PI;
		var duration = 1500;
		var percent = updatedPercent;
		var  fillColor= filledColor;
		var thickness = thicknessVal;
		var width = updatedWidth;
		var height = updatedHeight;
		var radius = Math.min(width, height) / 2;

		var pie = d3.pie()
		.value(function(d) {
			return d;
		})
		.sort(null)
		.startAngle(anglesRange * -1)
		.endAngle(anglesRange);

		var arc = d3.arc()
		.innerRadius(radius - thickness)
		.outerRadius(radius);

		var dataset = {
			lower: calcPercent(0),
			upper: calcPercent(percent)
		};
		var progress = 0;
		var timeout;
		timeout = setTimeout(function() {
			clearTimeout(timeout);
			var svg = d3.select("#"+updateChartId).selectAll('svg');
			var path = svg.selectAll("path");
			path = path.data(pie(dataset.upper));
			path.transition().duration(duration).attrTween("d", function(a, index) {
				var self = this;
				var i = d3.interpolate(this._current, a);
				var i2 = d3.interpolateNumber(progress, percent)
				this._current = i(0);
				return function(t) {
					d3.select(self).attr('fill', index !== 0 ? '#e2e3e4' : i2(t) > 5 ? '#'+fillColor : '#'+fillColor);
					// text.text(Math.round(i2(t)));
					return arc(i(t));
				};
			});
		}, 200);

		/*if(String(this.chartID)=='digital-rev-last-2yrs' || String(this.chartID)=='digital-cust-retention-2yrs' || String(this.chartID)=='digital-operation-exp-2yrs')
		{
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				var svg = d3.select("#"+updateChartId).selectAll('svg');
				var path = svg.selectAll("path");
				path = path.data(pie(dataset.upper));
				path.transition().duration(duration).attrTween("d", function(a, index) {
					var self = this;
					var i = d3.interpolate(this._current, a);
					var i2 = d3.interpolateNumber(progress, percent)
					this._current = i(0);
					return function(t) {
						d3.select(self).attr('fill', index !== 0 ? '#e2e3e4' : i2(t) > 5 ? '#'+fillColor : '#'+fillColor);
						// text.text(Math.round(i2(t)));
						return arc(i(t));
					};
				});
			}, 200);
		}
		else
		{*/
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				var svg = d3.select("#"+updateChartId).selectAll('svg');
				var path = svg.selectAll("path");
				path = path.data(pie(dataset.upper));
				path.transition().duration(duration).attrTween("d", function(a, index) {
					var self = this;
					var i = d3.interpolate(this._current, a);
					var i2 = d3.interpolateNumber(progress, percent)
					this._current = i(0);
					return function(t) {
						d3.select(self).attr('fill', index !== 0 ? '#e2e3e4' : i2(t) > 5 ? '#'+fillColor : '#'+fillColor);
						// text.text(Math.round(i2(t)));
						return arc(i(t));
					};
				});
			}, 200);
	//}

		function calcPercent(percent) {
			return [percent, 10 - percent];
		};
	}

}
