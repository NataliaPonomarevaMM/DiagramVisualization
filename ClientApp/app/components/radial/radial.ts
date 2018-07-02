import * as d3 from "d3";
import { Event, IMessage } from "../data.service";
import { IHierarchy } from "../iris";
import { Tooltip } from "../tooltip";

const sizes = {
    vHeight: 500,
    vWidth: 500,
};
const margin = {
    bottom: 20,
    left: 20,
    right: 20,
    top: 20,
};
const radius = (Math.min(sizes.vWidth, sizes.vHeight) / 2);
const arc = d3.arc<d3.HierarchyRectangularNode<{}>>()
            .startAngle((d) => d.x0)
            .endAngle((d) => d.x1)
            .innerRadius((d) => d.y0)
            .outerRadius((d) => d.y1);
const color = d3.scaleOrdinal(d3.schemePastel2);

export class Radial {
    private radial: d3.Selection<d3.BaseType, d3.HierarchyRectangularNode<{}>, d3.BaseType, {}>;

    constructor(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                data: d3.HierarchyNode<IHierarchy>,
                send: (msg: IMessage) => void) {
        const circle = svg
            .attr("width", sizes.vWidth + margin.left + margin.right)
            .attr("height", sizes.vHeight + margin.bottom + margin.top)
            .append("g")
            .attr("transform", "translate(" + (sizes.vWidth / 2 + margin.left) +
                    "," + (sizes.vHeight / 2 + margin.top) + ")");

        const desc = d3.partition().size([2 * Math.PI, radius])(data).descendants();
        this.radial = circle.selectAll("circle")
            .data(desc).enter().append("path")
            .attr("display", (d: d3.HierarchyRectangularNode<{}>) => d.depth ? null : "none")
            .attr("id", (d: d3.HierarchyRectangularNode<{}>) => "radial" + (d.data as IHierarchy).id)
            .attr("d", arc)
            .style("stroke", "#fff")
            .style("fill", (d: d3.HierarchyRectangularNode<{}>) =>
                color((d.data as IHierarchy).species + d.value + d.depth));
        const tooltip = new Tooltip(svg.append("text"));
        this.radial
            .on("mouseover", (d: d3.HierarchyRectangularNode<{}>) => {
                send({event: Event.Start, idElement: (d.data as IHierarchy).id});
                tooltip.setVisible((d.data as IHierarchy).species);
            })
            .on("mouseout", (d: d3.HierarchyRectangularNode<{}>) => {
                send({event: Event.Stop});
                tooltip.setInvisible();
            });
    }

    public setInvisible() {
        this.radial.style("fill", "none");
    }

    public setFilter(id: string) {
        this.radial.filter((d) => id.lastIndexOf((d.data as IHierarchy).id, 0) === 0)
            .style("fill", (d) => color((d.data as IHierarchy).species + d.value + d.depth));
    }

    public setVisible() {
        this.radial.style("fill", (d) => color((d.data as IHierarchy).species + d.value + d.depth));
    }
}
