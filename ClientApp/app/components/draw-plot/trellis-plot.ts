import * as d3 from "d3";
import { Event, IMessage} from "../data.service";
import { IIris } from "../iris";
import { Tooltip } from "../tooltip";
import { Axis, AxisType } from "./axis";
import { Brush } from "./brush";

const margin = {
    bottom: 15,
    left: 25,
    right: 5,
    top: 0,
};
const cValue = (d: IIris) => d.species;
const color = d3.scaleOrdinal(d3.schemeCategory10);

export class TrellisPlot {
    // axises
    private readonly height: number;
    private readonly width: number;
    private xAxis: Axis;
    private yAxis: Axis;
    // d3js components
    private readonly svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
    private plot: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}>;
    private brush: Brush;

    constructor(id: number, xValue: string, yValue: string,
                irises: IIris[], send: (msg: IMessage) => void) {
        const selection = d3.selectAll("plot").filter((d, i) => i === id);
        this.svg = selection.select("div").classed("svg-container", true)
            .append("svg").attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 210 200").classed("svg-content-responsive", true)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        const rect = (selection.node() as Element).getBoundingClientRect();
        this.width = rect.width - margin.left - margin.right;
        this.height = rect.width * 3 / 4 - margin.top - margin.bottom;
        this.xAxis = new Axis(0, this.width, AxisType.BOTTOM, xValue);
        this.yAxis = new Axis(this.height, 0, AxisType.LEFT, yValue);
        this.configureAxis(irises);
        this.brush = new Brush(this.svg, this.width, this.height, irises,
            (d: IIris) => {
                const x = this.xAxis.Map(d);
                const y = this.yAxis.Map(d);
                return {x, y};
            }, send, id);

        this.plot = this.svg.selectAll("circle").data(irises).enter().append("circle")
            .attr("id", (d, i) => "dot" + i)
            .attr("r", 2)
            .attr("cx", (d) => this.xAxis.Map(d))
            .attr("cy", (d) => this.yAxis.Map(d))
            .style("fill", (d: IIris) => color(cValue(d)));
        const tooltip = new Tooltip(this.svg.append("text"));
        this.plot
            .on("mouseover", (d: IIris) => {
                tooltip.setVisible(d.species, this.xAxis.Value(d), this.yAxis.Value(d));
            })
            .on("mouseout", (d: IIris) => {
                tooltip.setInvisible();
            });

    }

    public stopBrush() {
        if (this.brush) {
            this.brush.stopBrush();
        }
    }

    public setCircleRadius(id: string) {
        if (this.plot) {
            this.plot.attr("r", (d) => d.id.lastIndexOf(id, 0) === 0 ? 5 : 2);
        }
    }

    public clearRadius() {
        if (this.plot) {
            this.plot.attr("r", 2);
        }
    }

    private configureAxis(irises: IIris[]) {
        this.xAxis.configureAxis(irises);
        this.yAxis.configureAxis(irises);

        this.svg.append<SVGGElement>("g")
        .attr("transform", "translate(0," + this.height + ")")
        .attr("class", "x axis").call(this.xAxis.Axis).append("text")
        .attr("font-size", "8px")
        .attr("class", "label").attr("x", this.width).attr("y", -6)
        .style("text-anchor", "end").text("X");

        this.svg.append<SVGGElement>("g")
        .attr("class", "y axis").call(this.yAxis.Axis).append("text")
        .attr("font-size", "8px").attr("class", "label")
        .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end").text("Y");
    }
}
