import { Component, Input, OnChanges, OnInit,
        SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService, Event, IMessage } from "../data.service";
import { IHierarchy,  IIris } from "../iris";
import * as config from "./plot.config";

@Component({
    selector: "plot",
    templateUrl: "./plot.component.html",
})
export class DrawPlotComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy |  null = null;
    @Input() public YMean: string = "";
    @Input() public XMean: string = "";
    private plot: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}> | null = null;
    private brushSelection: d3.Selection<SVGGElement, {}, HTMLElement, any> | null = null;
    private brush: d3.BrushBehavior<{}> | null = null;
    private id = 0;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentRadialMessage.subscribe((m) => this.getMessage(m));
        this.data.currentBrushMessage.subscribe((m) => this.stopBrush(m));
    }

    public ngOnChanges(changes: SimpleChanges) {
        const irises: SimpleChange = changes.Irises;
        const xMean: SimpleChange = changes.XMean;
        const yMean: SimpleChange = changes.YMean;
        if (irises && xMean && yMean) {
            this.draw(irises.currentValue, xMean.currentValue, yMean.currentValue);
        }
    }

    private getMessage(msg: IMessage) {
        if (this.plot) {
            this.plot.attr("r", (d) => msg.event === Event.Start &&
                d.id.lastIndexOf(msg.id, 0) === 0 ? 5 : 2);
        }
    }

    private stopBrush(message: IMessage) {
        if (this.id !== +message.id && this.brush && this.brushSelection) {
            this.brushSelection.call(this.brush.move, null);
        }
    }

    private draw(data: IHierarchy, xMean: string, yMean: string) {
        this.id = config.getIndex(xMean) * 4 + config.getIndex(yMean);
        const svg = config.getSvg(d3.selectAll("plot").filter((d, i) => i === this.id));

        const root = d3.hierarchy<IHierarchy>(data, (d: IHierarchy) => d.children ? d.children : null);
        const irises = root.leaves().map((el) => el.data.data).reduce((prev, cur) => prev.concat(cur));

        const axis = config.configureAxis(svg, irises, xMean, yMean);
        this.plot = config.setData(svg, irises, xMean, yMean, axis.xMap, axis.yMap);
        this.brush = config.setBrush(this.plot, xMean, yMean, (m) => this.data.sendPlot(m),
            this.id, axis.xMap, axis.yMap);
        this.brushSelection = svg.append<SVGGElement>("g").call(this.brush);
    }
}
