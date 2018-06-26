import * as d3 from "d3";
import { IIris } from "../iris";

export enum AxisType {
    "BOTTOM",
    "LEFT",
}

export class Axis {
    private value: string;
    private scale: d3.ScaleLinear<number, number>;
    private axis: d3.Axis<number | {valueOf(): number; }>;
    public get Axis() { return this.axis; }
    public get Map() { return this.map; }
    public get Value() { return (d: IIris): number => getAxisValue(d, this.value); }

    constructor(x: number, y: number, type: AxisType, value: string) {
        this.scale = d3.scaleLinear().range([x, y]);
        switch (type) {
            case AxisType.BOTTOM:
                this.axis = d3.axisBottom(this.scale);
                break;
            case AxisType.LEFT:
            default:
                this.axis = d3.axisLeft(this.scale);
                break;
        }
        this.value = value;
    }

    public configureAxis(irises: IIris[]) {
        const min = d3.min(irises, (d) => this.Value(d)) || 0;
        const max = d3.max(irises, (d) => this.Value(d)) || 0;
        this.scale.domain([min - 1, max + 1]);
    }

    private map = (d: IIris) => this.scale(this.Value(d));

}

export const getAxisValue = (el: IIris, axis: string): number => {
    switch (axis) {
    case "petalLength":
        return el.petalLength;
    case "petalWidth":
        return el.petalWidth;
    case "sepalLength":
        return el.sepalLength;
    case "sepalWidth":
        return el.sepalWidth;
    default:
        return el.petalLength;
    }
};
