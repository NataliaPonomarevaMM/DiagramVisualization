import { Component, Inject, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { range, HierarchyRectangularNode, HierarchyNode } from 'd3';
import { IrisTree } from '../iris';

const sizes = {
    vWidth: 500,
    vHeight: 500,
}
const config = {
    radius: (Math.min(sizes.vWidth, sizes.vHeight) / 2) - 10,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    arc: d3.arc<HierarchyRectangularNode<{}>>()
            .startAngle(function (d) { return d.x0 })
            .endAngle(function (d) { return d.x1 })
            .innerRadius(function (d) { return d.y0 })
            .outerRadius(function (d) { return d.y1 }),
}

@Component({
    selector: 'radial',
    templateUrl: './radial.component.html'
})
export class RadialComponent implements OnChanges{
    @Input() irises: IrisTree;
    private _irises: IrisTree;
    
    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let chng = changes[propName];
            switch(propName) {
                case "irises":
                    this._irises = chng.currentValue;
                    break;
            }
          }
        this.draw();
    }

    draw()
    {
        const g = d3.select('svg')
            .attr('width', sizes.vWidth)
            .attr('height', sizes.vHeight)
            .append('g')
            .attr('transform', 'translate(' + sizes.vWidth / 2 + ',' + sizes.vHeight / 2 + ')');
        const tooltip = d3.select("div").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Find data root
        const root = d3.hierarchy<IrisTree>(this._irises, function(d: IrisTree) { return d.children ? d.children : null; })
            .sum(function (d) { return 1; });
        const desc = d3.partition().size([2 * Math.PI, config.radius])(root).descendants(); 

        g.selectAll('circle')
            .data(desc).enter().append('path')
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", config.arc)
            .style('stroke', '#fff')
            .style("fill", function (d) { 
                return config.color(d.depth.toString()); 
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", .9);
                tooltip.html((d.data as IrisTree).data.species)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
}