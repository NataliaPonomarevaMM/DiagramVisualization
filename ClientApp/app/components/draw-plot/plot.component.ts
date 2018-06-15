import { Component, Input, Output, OnChanges,
        SimpleChange, SimpleChanges, EventEmitter } from "@angular/core";
import * as d3 from "d3";
import { IIris, IHierarchy } from "../iris";
import { getSvg, config, getAxisValue } from "../config";

@Component({
    selector: "plot",
    templateUrl: "./plot.component.html",
})
export class DrawPlotComponent implements OnChanges {
    @Input() public Irises: IHierarchy |  null = null;
    @Input() public YMean: string = "";
    @Input() public XMean: string = "";
    @Input() public Message: string = "";
    @Output() public Event = new EventEmitter<string>();
    private irises: IHierarchy | null = null;
    private xMean: string = "";
    private yMean: string = "";
    private result: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}> | null = null;

    public drawBigDots(message: string) {
        const splitted = message.split(" ");
        if (this.result != null)
            this.result.attr("r", (d) => splitted[0] === "on" && d.species === splitted[1] ? 5 : 2);
    }

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
        data = changes.Message;
        if (data !== undefined) {
            this.drawBigDots(data.currentValue);
        }

        if (this.irises !== null) {
            this.draw();
        }
    }

    public draw() {
        // setup x
        const xValue = (d: IIris): number => getAxisValue(d, this.xMean);
        const xScale = d3.scaleLinear().range([0, config.width]);
        const xAxis = d3.axisBottom(xScale);
        const xMap = (d: IIris) => xScale(xValue(d));

        // setup y
        const yValue = (d: IIris): number => getAxisValue(d, this.yMean);
        const yScale = d3.scaleLinear().range([config.height, 0]);
        const yAxis = d3.axisLeft(yScale);
        const yMap = (d: IIris) => yScale(yValue(d));

        // add the tooltip area to the webpage
        const tooltip = d3.select("div").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const root = d3.hierarchy<IHierarchy>(this.irises as IHierarchy, 
            (d: IHierarchy) => d.children ? d.children : null);

        const irises = root.leaves().map(el => el.data.data).reduce((prev, cur) => prev.concat(cur));

        const minx = d3.min(irises, xValue) || 0;
        const maxx = d3.max(irises, xValue) || 0;
        const miny = d3.min(irises, yValue) || 0;
        const maxy = d3.max(irises, yValue) || 0;
        xScale.domain([minx - 1, maxx + 1]);
        yScale.domain([miny - 1, maxy + 1]);

        // draw dots
        this.result = getSvg(xAxis, yAxis).selectAll("circle")
        .data(irises)
        .enter().append("circle")
        .attr("id", (d, i) => "dot" + i)
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", (d: IIris) => config.color(config.cValue(d)))
        .on("mouseover", (d: IIris) => {
            this.Event.emit("on " + d.species);
            tooltip.transition()
                .duration(500)
                .style("opacity", .9);
            tooltip.html(d.species + "<br/> (" + xValue(d)
                + ", " + yValue(d) + ")")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", (d: IIris) => {
            this.Event.emit("out " + d.species);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }
}
