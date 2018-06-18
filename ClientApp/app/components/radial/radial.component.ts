import { Component, Inject,
    Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { DataService } from "../data.service";
import { IHierarchy } from "../iris";
import * as config from "./radial.config";

@Component({
    selector: "radial",
    templateUrl: "./radial.component.html",
})
export class RadialComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy | null = null;
    private irises: IHierarchy | null = null;
    private result: d3.Selection<d3.BaseType, d3.HierarchyRectangularNode<{}>,
                    d3.BaseType, {}> | null = null;

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentPlotMessage.subscribe((msg) => this.result ? config.getMessage(this.result, msg) : null);
    }

    public ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.Irises;
        this.irises = data.currentValue;
        this.draw();
    }

    public draw() {
        const root = d3.hierarchy<IHierarchy>(this.irises as IHierarchy,
            (d: IHierarchy) => d.children ? d.children : null)
            .sum((d: IHierarchy) => 1);
        const desc = d3.partition().size([2 * Math.PI, config.radius])(root).descendants();
        const svg = config.getSvg();
        this.result = config.getData(svg, desc, (msg) => this.result ? config.getMessage(this.result, msg) : null);
    }
}
