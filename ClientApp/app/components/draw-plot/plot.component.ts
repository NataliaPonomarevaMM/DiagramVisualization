import { Component, Inject, Input, OnChanges,
        SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { range } from "d3";
import { IIris} from "../iris";

@Component({
    selector: "plot",
    templateUrl: "./plot.component.html",
})

export class DrawPlotComponent implements OnChanges{
    @Input() public Irises: IIris[] = [];
    @Input() public YMean: string = "";
    @Input() public XMean: string = "";
    private irises: IIris[] = [];
    private xMean: string = "";
    private yMean: string = "";

    public ngOnChanges(changes: SimpleChanges) {
        let data: SimpleChange = changes.Irises;
        if (data !== undefined) {
            this.irises = data.currentValue;
        }
        data = changes.XMean;
        if (data !== undefined) {
            this.xMean = data.currentValue;
        }
        data = changes.YMean;
        if (data !== undefined) {
            this.yMean = data.currentValue;
        }

        console.log(this.irises);
        if (this.irises.length !== 0) {
            this.draw();
        }
    }

    public getCurValue(el: IIris, d: boolean): number {
        const toCompare = d ? this.xMean : this.yMean;
        switch (toCompare) {
        case "petalLength":
            return el.petalLength;
        case "petalWidth":
            return el.petalWidth;
        case "sepalLength":
            return el.sepalLength;
        case "sepalWidth":
            return el.sepalWidth;
        default:
            return el.petalLength;
        }
    }

    public draw() {
        const cur = this;

        const margin = {top: 5, right: 10, bottom: 20, left: 30};
        const width = 200 - margin.left - margin.right;
        const height = 150 - margin.top - margin.bottom;

        // setup x
        const xValue = (d: IIris): number => cur.getCurValue(d, true);
        const xScale = d3.scaleLinear().range([0, width]);
        const xAxis = d3.axisBottom(xScale);
        const xMap = (d: IIris) => xScale(xValue(d));

        // setup y
        const yValue = (d: IIris): number => cur.getCurValue(d, false);
        const yScale = d3.scaleLinear().range([height, 0]);
        const yAxis = d3.axisLeft(yScale);
        const yMap = (d: IIris) => yScale(yValue(d));

        const cValue = (d: IIris) => d.species;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // add the graph canvas to the body of the webpage
        const svg = d3.select("div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        const tooltip = d3.select("div").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const minx = d3.min(this.irises, xValue) || 0;
        const maxx = d3.max(this.irises, xValue) || 0;
        const miny = d3.min(this.irises, yValue) || 0;
        const maxy = d3.max(this.irises, yValue) || 0;
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
        .data(this.irises)
        .enter().append("circle")
        .attr("class", "dodo")
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", (d: IIris) => color(cValue(d)))
        .on("mouseover", (d: IIris) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", .9);
            tooltip.html(d.species + "<br/> (" + xValue(d)
                + ", " + yValue(d) + ")")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", (d: IIris) => {
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
