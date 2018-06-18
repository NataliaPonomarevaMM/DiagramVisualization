import { Component, Input, OnChanges, OnInit,
        SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService } from "../data.service";
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
    private result: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}> | null = null;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentRadialMessage.subscribe((msg) => this.result ? config.getMessage(this.result, msg) : null);
    }

    public ngOnChanges(changes: SimpleChanges) {
        const irises: SimpleChange = changes.Irises;
        const xMean: SimpleChange = changes.XMean;
        const yMean: SimpleChange = changes.YMean;
        if (irises && xMean && yMean) {
            this.draw(irises.currentValue, xMean.currentValue, yMean.currentValue);
        }

        const msg = changes.Message;
        if (msg !== undefined && this.result) {
            config.getMessage(this.result, msg.currentValue);
        }
    }

    public draw(data: IHierarchy, xMean: string, yMean: string) {
        const root = d3.hierarchy<IHierarchy>(data, (d: IHierarchy) => d.children ? d.children : null);
        const irises = root.leaves().map((el) => el.data.data).reduce((prev, cur) => prev.concat(cur));
        const svg = config.getSvg();
        this.result = config.setData(svg, irises, xMean, yMean);
        config.setBrush(svg, this.result, xMean, yMean, (msg) =>
            this.result ? config.getMessage(this.result, msg) : null);
    }
}
