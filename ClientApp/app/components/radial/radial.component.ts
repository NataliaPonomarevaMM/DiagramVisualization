import { Component, Inject,
    Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { HierarchyNode, HierarchyRectangularNode, range } from "d3";
import { DataService } from "../data.service";
import { IHierarchy } from "../iris";

const sizes = {
    vHeight: 500,
    vWidth: 500,
};
const config = {
    arc: d3.arc<HierarchyRectangularNode<{}>>()
            .startAngle((d) => d.x0)
            .endAngle((d) => d.x1)
            .innerRadius((d) => d.y0)
            .outerRadius((d) => d.y1),
    color: d3.scaleOrdinal(d3.schemeCategory10),
    radius: (Math.min(sizes.vWidth, sizes.vHeight) / 2) - 10,
};

@Component({
    selector: "radial",
    templateUrl: "./radial.component.html",
})
export class RadialComponent implements OnChanges, OnInit {
    @Input() public Irises: IHierarchy;
    private irises: IHierarchy;
    private message: string = "";

    constructor(private data: DataService) {
    }

    public ngOnInit() {
        this.data.currentMessage.subscribe((message) => { this.message = message; });
    }

    public ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.Irises;
        this.irises = data.currentValue;
        this.draw();
    }

    public draw() {
        const g = d3.select("svg")
            .attr("width", sizes.vWidth)
            .attr("height", sizes.vHeight)
            .append("g")
            .attr("transform", "translate(" + sizes.vWidth / 2 + "," + sizes.vHeight / 2 + ")");
        const tooltip = d3.select("div").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Find data root
        const root = d3.hierarchy<IHierarchy>(this.irises, (d: IHierarchy) => d.children ? d.children : null)
            .sum((d: IHierarchy) => 1);
        const desc = d3.partition().size([2 * Math.PI, config.radius])(root).descendants();

        g.selectAll("circle")
            .data(desc).enter().append("path")
            .attr("display", (d) => d.depth ? null : "none")
            .attr("id", (d, i) => "circle" + i)
            .attr("d", config.arc)
            .style("stroke", "#fff")
            .style("fill", (d) => config.color((d.data as IHierarchy).species + d.value + d.depth))
            .on("mouseover", (d, i) => {
                this.data.changeMessage("on " + (d.data as IHierarchy).species);
                // d3.select("#circle" + i)
                //    .style("stroke", "red")
                //    .style("fill", "none");
                tooltip.transition()
                    .duration(400)
                    .style("opacity", .9);
                tooltip.html((d.data as IHierarchy).species)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px");
            })
            .on("mouseout", (d, i) => {
                this.data.changeMessage("out " + (d.data as IHierarchy).species);
                // d3.select("#circle" + i)
                //    .style("stroke", "#fff")
                //    .style("fill", () => config.color((d.data as IHierarchy).species + d.value + d.depth));
                tooltip.transition()
                    .duration(400)
                    .style("opacity", 0);
            });
    }
}
