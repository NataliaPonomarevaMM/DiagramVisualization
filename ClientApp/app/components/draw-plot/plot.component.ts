import { Component, Input, OnChanges, OnInit,
        SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService } from "../data.service";
import { IHierarchy,  IIris } from "../iris";
import * as config from "./plot.config";

const getIndex = (str: string): number => {
    switch (str) {
    case "sepalLength":
        return 0;
    case "sepalWidth":
        return 1;
    case "petalLength":
        return 2;
    case "petalWidth":
        return 3;
    default:
        return 0;
    }
};

@Component({
    selector: "plot",
    templateUrl: "./plot.component.html",
})
export class DrawPlotComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy |  null = null;
    @Input() public YMean: string = "";
    @Input() public XMean: string = "";
    private result: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}> | null = null;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentRadialMessage.subscribe((msg) =>  this.result ? config.getMessage(this.result, msg) : null);
    }

    public ngOnChanges(changes: SimpleChanges) {
        const irises: SimpleChange = changes.Irises;
        const xMean: SimpleChange = changes.XMean;
        const yMean: SimpleChange = changes.YMean;
        if (irises && xMean && yMean) {
            this.draw(irises.currentValue, xMean.currentValue, yMean.currentValue);
        }
    }

    public draw(data: IHierarchy, xMean: string, yMean: string) {
        const root = d3.hierarchy<IHierarchy>(data, (d: IHierarchy) => d.children ? d.children : null);
        const irises = root.leaves().map((el) => el.data.data).reduce((prev, cur) => prev.concat(cur));

        const svg = config.getSvg(d3.selectAll("plot").filter((d, i) => i === (getIndex(xMean) * 4 + getIndex(yMean))));
        const xValue = (d: IIris, axis: string): number => config.getAxisValue(d, axis);
        const xScale = d3.scaleLinear().range([0, config.width]);
        const xAxis = d3.axisBottom(xScale);
        const xMap = (d: IIris, axis: string) => xScale(xValue(d, axis));

        const yValue = (d: IIris, axis: string): number => config.getAxisValue(d, axis);
        const yScale = d3.scaleLinear().range([config.height, 0]);
        const yAxis = d3.axisLeft(yScale);
        const yMap = (d: IIris, axis: string) => yScale(yValue(d, axis));

        const minx = d3.min(irises, (d) => xValue(d, xMean)) || 0;
        const maxx = d3.max(irises, (d) => xValue(d, xMean)) || 0;
        const miny = d3.min(irises, (d) => yValue(d, yMean)) || 0;
        const maxy = d3.max(irises, (d) => yValue(d, yMean)) || 0;
        xScale.domain([minx - 1, maxx + 1]);
        yScale.domain([miny - 1, maxy + 1]);
        config.configureAxis(svg, xAxis, yAxis);
        this.result = config.setData(svg, irises, xMean, yMean, xMap, yMap);
        const some = config.setBrush(svg, this.result, xMean, yMean, (msg) => this.data.sendPlot(msg), xMap, yMap);
        console.log(svg);
    }
}
