import * as d3 from "d3";
import { IIris } from "./iris";

export class Tooltip {
    private readonly tooltip: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

    constructor(tooltip: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
        this.tooltip = tooltip;
    }

    public setVisible(text: string, x?: number, y?: number) {
        if (x && y) {
            this.tooltip
            .attr("x", +d3.event.layerX - 20)
            .attr("y", +d3.event.layerY)
            .style("fill-opacity", 1)
            .text(text);
            this.tooltip.append("tspan")
                .attr("x", +d3.event.layerX - 20)
                .attr("dy", ".9em")
                .text("(" + x + ";" + y + ")");
        } else {
            this.tooltip
            .attr("x", +d3.event.layerX - 100)
            .attr("y", +d3.event.layerY)
            .style("fill-opacity", 1)
            .text(text);
        }
    }

    public setInvisible() {
        this.tooltip.style("fill-opacity", 0);
    }
}
