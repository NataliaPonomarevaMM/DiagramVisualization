import { Component, Input, OnChanges, OnInit,
        SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService, Event, IMessage } from "../data.service";
import { IHierarchy,  IIris } from "../iris";
import { TrellisPlot } from "./trellis-plot";

@Component({
    selector: "plot",
    styleUrls: ["plot.component.css"],
    templateUrl: "./plot.component.html",
})
export class DrawPlotComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy |  null = null;
    @Input() public YMean: string = "";
    @Input() public XMean: string = "";
    private id = 0;
    private plot: TrellisPlot | null = null;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentRadialMessage.subscribe((m) => this.getRadialMessage(m));
        this.data.currentBrushMessage.subscribe((m) => this.getBrushMessage(m));
        // this.data.currentPlotMessage.subscribe((m) => this.getPlotMessage(m));
    }

    public ngOnChanges(changes: SimpleChanges) {
        const irises: SimpleChange = changes.Irises;
        const xMean: SimpleChange = changes.XMean;
        const yMean: SimpleChange = changes.YMean;
        if (irises && xMean && yMean) {
            this.draw(irises.currentValue, xMean.currentValue, yMean.currentValue);
        }
    }

    private getRadialMessage(msg: IMessage) {
        switch (msg.event) {
            case Event.Start:
                if (msg.idElement && this.plot) {
                    this.plot.setCircleRadius(msg.idElement);
                }
                break;
            case Event.Stop:
                if (this.plot) {
                    this.plot.clearRadius();
                }
                break;
        }
    }

    private getBrushMessage(msg: IMessage) {
        switch (msg.event) {
            case Event.Start:
                if (msg.idSource && this.id !== msg.idSource && this.plot) {
                    this.plot.stopBrush();
                }
                break;
            case Event.Stop:
                if (this.plot) {
                    this.plot.stopBrush();
                }
                break;
        }
    }

    private getPlotMessage(msg: IMessage) {
        switch (msg.event) {
            case Event.Continue:
                if (msg.idElement && this.plot) {
                    this.plot.setCircleRadius(msg.idElement);
                }
                break;
        }
    }

    private draw(data: IHierarchy, x: string, y: string) {
        this.id = getIndex(x) * 4 + getIndex(y);
        const root = d3.hierarchy<IHierarchy>(data, (d: IHierarchy) => d.children ? d.children : null);
        const irises = root.leaves().map((el) => el.data.data).reduce((prev, cur) => prev.concat(cur));
        this.plot = new TrellisPlot(this.id, x, y, irises, (m) => this.data.sendPlot(m));
    }
}

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
