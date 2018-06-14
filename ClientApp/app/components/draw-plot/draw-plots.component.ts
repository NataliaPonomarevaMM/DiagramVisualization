import { Component, Inject, Input,
    OnChanges, OnInit, SimpleChange, SimpleChanges } from "@angular/core";
import { IIris} from "../iris";

@Component({
    selector: "draw-plot",
    templateUrl: "./draw-plots.component.html",
})

export class DrawPlotsComponent implements OnChanges {
    @Input() public Irises: IIris[] = [];
    public irises: IIris[] = [];
    public elementNames = ["sepalLength", "sepalWidth", "petalLength", "petalWidth"];

    public ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.Irises;
        if (data !== undefined) {
            this.irises = data.currentValue;
        }
    }
}
