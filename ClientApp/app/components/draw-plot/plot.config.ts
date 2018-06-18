import * as d3 from "d3";
import { IIris } from "../iris";

const margin = {
    bottom: 20,
    left: 30,
    right: 10,
    top: 5,
};
export const config = {
    cValue: (d: IIris) => d.species,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    height: 150 - margin.top - margin.bottom,
    width: 200 - margin.left - margin.right,
};

export const getSvg = (selection: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                       xAxis: d3.Axis<number | {valueOf(): number; }>,
                       yAxis: d3.Axis<number | {valueOf(): number; }>) => {
    const svg = selection.select("div").append("svg")
//              .attr("class", "svg_plot")
//            .attr("width", config.width + margin.left + margin.right)
//            .attr("height", config.height + margin.top + margin.bottom)
            .attr("width", "100%")
            .attr("height", 200)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x-axis
    svg.append<SVGGElement>("g")
    .attr("transform", "translate(0," + config.height + ")")
    .attr("class", "x axis").call(xAxis).append("text")
    .attr("class", "label").attr("x", config.width).attr("y", -6)
    .style("text-anchor", "end").text("X");

    // y-axis
    svg.append<SVGGElement>("g")
    .attr("class", "y axis").call(yAxis).append("text").attr("class", "label")
    .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em")
    .style("text-anchor", "end").text("Y");
    return svg;
};

export const setData = (svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                        irises: IIris[], x: string, y: string,
                        xMap: (d: IIris, axis: string) => number,
                        yMap: (d: IIris, axis: string) => number) => {
    const tooltip = svg.append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    return svg.selectAll("circle")
        .data(irises)
        .enter().append("circle")
        .attr("id", (d, i) => "dot" + i)
        .attr("r", 2)
        .attr("cx", (d) => xMap(d, x))
        .attr("cy", (d) => yMap(d, y))
        .style("fill", (d: IIris) => config.color(config.cValue(d)))
        .on("mouseover", (d: IIris) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", .9);
            tooltip.html(d.species)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", (d: IIris) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

export const setBrush = (svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                         data: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}>,
                         x: string, y: string, send: (msg: string) => void,
                         xMap: (d: IIris, axis: string) => number,
                         yMap: (d: IIris, axis: string) => number) => {
    const brush = d3.brush()
            .extent([[0, 0], [config.width, config.height]])
            .on("start", () => { send("start"); })
            .on("brush", () => {
                send("start");
                data.each((d) => {
                    if (xMap(d, x) >= d3.event.selection[0][0] &&
                        xMap(d, x) <= d3.event.selection[1][0] &&
                        yMap(d, y) >= d3.event.selection[0][1] &&
                        yMap(d, y) <= d3.event.selection[1][1]) {
                            send("on " + d.id);
                    }
                });
            })
            .on("end", () => { send("stop"); });
    return svg.append<SVGGElement>("g").call(brush);
};

export const getMessage = (data: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}>, msg: string) => {
    const splitted = msg.split(" ");
    data.attr("r", (d) => splitted[0] === "on" &&
        d.id.lastIndexOf(splitted[1], 0) === 0 ? 5 : 2);
};

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
