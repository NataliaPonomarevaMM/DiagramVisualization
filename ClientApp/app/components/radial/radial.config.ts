import * as d3 from "d3";
import { Event, IMessage} from "../data.service";
import { IHierarchy } from "../iris";

const sizes = {
    vHeight: 500,
    vWidth: 500,
};
const config = {
    arc: d3.arc<d3.HierarchyRectangularNode<{}>>()
            .startAngle((d) => d.x0)
            .endAngle((d) => d.x1)
            .innerRadius((d) => d.y0)
            .outerRadius((d) => d.y1),
    color: d3.scaleOrdinal(d3.schemeCategory10),
};
const tooltip = d3.select("div").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

export const radius = (Math.min(sizes.vWidth, sizes.vHeight) / 2) - 10;

export const configSvg = (svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>) => {
    return svg.attr("width", sizes.vWidth)
            .attr("height", sizes.vHeight)
            .append("g")
            .attr("transform", "translate(" + sizes.vWidth / 2 + "," + sizes.vHeight / 2 + ")");
};

export const getData = (svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                        data: Array<d3.HierarchyRectangularNode<{}>>,
                        send: (msg: IMessage) => void) => {
    return svg.selectAll("circle")
        .data(data).enter().append("path")
        .attr("display", (d: d3.HierarchyRectangularNode<{}>) => d.depth ? null : "none")
        .attr("id", (d: d3.HierarchyRectangularNode<{}>) => "radial" + (d.data as IHierarchy).id)
        .attr("d", config.arc)
        .style("stroke", "#fff")
        .style("fill", (d: d3.HierarchyRectangularNode<{}>) =>
            config.color((d.data as IHierarchy).species + d.value + d.depth))
        .on("mouseover", (d: d3.HierarchyRectangularNode<{}>) => {
            send({event: Event.Start, id: (d.data as IHierarchy).id});
            tooltip.transition()
                .duration(400)
                .style("opacity", .9);
            tooltip.html((d.data as IHierarchy).species)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", (d: d3.HierarchyRectangularNode<{}>) => {
            send({event: Event.Stop, id: ""});
            tooltip.transition()
                .duration(400)
                .style("opacity", 0);
        });
};

export const getMessage = (result: d3.Selection<d3.BaseType, d3.HierarchyRectangularNode<{}>, d3.BaseType, {}>,
                           msg: IMessage) => {
    switch (msg.event) {
        case Event.Start:
            result.style("fill", "none");
            break;
        case Event.Stop:
            result.style("fill", (d) => config.color((d.data as IHierarchy).species + d.value + d.depth));
            break;
        case Event.Continue:
            result.filter((d) => msg.id.lastIndexOf((d.data as IHierarchy).id, 0) === 0)
                .style("fill", (d) => config.color((d.data as IHierarchy).species + d.value + d.depth));
            break;
    }
};
