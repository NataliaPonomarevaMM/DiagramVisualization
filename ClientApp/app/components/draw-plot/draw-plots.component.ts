import { Component, Inject, Input,
    OnChanges, OnInit, SimpleChange, SimpleChanges } from "@angular/core";
import { IHierarchy } from "../iris";
import { DataService } from "../data.service";

@Component({
    selector: "draw-plot",
    templateUrl: "./draw-plots.component.html",
})
export class DrawPlotsComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy |  null = null;
    public irises: IHierarchy |  null = null;
    public elementNames = ["sepalLength", "sepalWidth", "petalLength", "petalWidth"];
    public message = "";

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentRadialMessage.subscribe((message) => this.message = message);
    }

    public ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.Irises;
        if (data !== undefined) {
            this.irises = data.currentValue;
        }
    }

    public sendMessage(message: string) {
        this.data.sendPlot(message);
    }
}
