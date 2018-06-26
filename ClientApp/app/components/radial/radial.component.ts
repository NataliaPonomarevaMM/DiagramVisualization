import { Component, Inject,
    Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService, Event, IMessage } from "../data.service";
import { IHierarchy } from "../iris";
import { Radial } from "./radial";

@Component({
    selector: "radial",
    templateUrl: "./radial.component.html",
})
export class RadialComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy | null = null;
    private radial: Radial | null = null;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentPlotMessage.subscribe((msg) => this.getMessage(msg));
    }

    public ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.Irises;
        this.draw(data.currentValue);
    }

    public getMessage(msg: IMessage) {
        switch (msg.event) {
            case Event.Start:
                if (this.radial) {
                    this.radial.setInvisible();
                }
                break;
            case Event.Stop:
                if (this.radial) {
                    this.radial.setVisible();
                }
                break;
            case Event.Continue:
                if (msg.id && this.radial) {
                    this.radial.setFilter(msg.id);
                }
                break;
        }
    }

    public draw(irises: IHierarchy) {
        const root = d3.hierarchy<IHierarchy>(irises, (d: IHierarchy) => d.children ? d.children : null)
                    .sum((d: IHierarchy) => 1);

        this.radial = new Radial(d3.select("svg"), root, (msg) => this.data.sendRadial(msg));
    }
}
