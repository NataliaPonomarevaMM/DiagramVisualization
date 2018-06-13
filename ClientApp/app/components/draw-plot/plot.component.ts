import { Component, Inject, Input, OnChanges,
        SimpleChange, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { range } from 'd3';
import { Iris}  from '../iris';

@Component({
    selector: 'plot',
    templateUrl: './plot.component.html'
})

export class DrawPlotComponent implements OnChanges{
    private  _irises: Iris[] = [];
    @Input() irises: Iris[] = [];
    private  _xMean: string = "";
    @Input() xMean: string = "";
    private  _yMean: string = ""; 
    @Input() yMean: string = "";
    

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let chng = changes[propName];
            switch(propName) {
                case "irises":
                    this._irises = chng.currentValue;
                    break;
                case "xMean":
                    this._xMean = chng.currentValue;
                    break;
                case "yMean":
                    this._yMean = chng.currentValue;
                    break;
            }
          }
        if (this._irises.length != 0)
            this.draw();
    }

    getCurValue(el: Iris, d: boolean): number {
        var toCompare = d ? this.xMean : this.yMean;
        switch(toCompare) {
        case 'petalLength':
            return el.petalLength;
        case 'petalWidth':
            return el.petalWidth;
        case 'sepalLength':
            return el.sepalLength;
        case 'sepalWidth':
            return el.sepalWidth;
        default:
            return el.petalLength;
        }
    }
    draw() {
        var margin = {top: 5, right: 10, bottom: 20, left: 30},
        width = 200 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

        // setup x 
        var cur = this;
        var xValue = function(d: Iris): number { return cur.getCurValue(d, true); }; 
        var xScale = d3.scaleLinear().range([0, width]); 
        var xAxis = d3.axisBottom(xScale);
        var xMap = function(d: Iris) { return xScale(xValue(d));};

        // setup y
        var yValue = function(d: Iris): number { return cur.getCurValue(d, false); }; 
        var yScale = d3.scaleLinear().range([height, 0]); 
        var yAxis = d3.axisLeft(yScale);
        var yMap = function(d: Iris) { return yScale(yValue(d));};

        var cValue = function(d: Iris) { return d.species};
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // add the graph canvas to the body of the webpage
        var svg = d3.select("div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("div").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


        var minx = d3.min(this._irises, xValue) || 0;
        var maxx = d3.max(this._irises, xValue) || 0;
        var miny = d3.min(this._irises, yValue) || 0;
        var maxy = d3.max(this._irises, yValue) || 0;
        xScale.domain([minx - 1, maxx + 1]);
        yScale.domain([miny - 1, maxy + 1]);

        // x-axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("X");

        // y-axis
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Y");

        // draw dots
        svg.selectAll(".dodo")
        .data(this._irises)
        .enter().append("circle")
        .attr("class", "dodo")
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));}) 
        .on("mouseover", function(d: Iris) {
            tooltip.transition()
                .duration(500)
                .style("opacity", .9);
            tooltip.html(d.species + "<br/> (" + xValue(d) 
                + ", " + yValue(d) + ")")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

          // draw legend
        /*var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        // draw legend text
        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;}) */
    }
}