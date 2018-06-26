import * as d3 from "d3";
import { Event, IMessage } from "../data.service";
import { IIris } from "../iris";

export class Brush {
    private brushSelection: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private brush: d3.BrushBehavior<{}>;

    constructor(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                width: number, height: number,
                irises: IIris[],
                getPos: (iris: IIris) => { x: number, y: number },
                send: (msg: IMessage) => void, id: string) {
        this.brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start", () => {
                if (d3.event.selection != null) {
                    if (d3.event.selection[0][0] === d3.event.selection[1][0] &&
                        d3.event.selection[0][1] === d3.event.selection[1][1]) {
                            send({event: Event.Stop});
                    } else {
                            send({event: Event.Start, id});
                    }
                }
            })
            .on("brush", () => {
                if (d3.event.selection != null) {
                    send({event: Event.Start, id});
                    irises.forEach((d) => {
                        const {x, y} = getPos(d);
                        if (x >= d3.event.selection[0][0] && x <= d3.event.selection[1][0] &&
                            y >= d3.event.selection[0][1] && y <= d3.event.selection[1][1]) {
                                send({event: Event.Continue, id: d.id});
                        }
                    });
                }
            });

        this.brushSelection = svg.append<SVGGElement>("g").call(this.brush);
    }

    public stopBrush() {
        this.brushSelection.call(this.brush.move, null);
    }
}
