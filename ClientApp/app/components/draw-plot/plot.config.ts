import * as d3 from "d3";
import { IIris } from "../iris";

const margin = {
    bottom: 20,
    left: 30,
    right: 10,
    top: 5,
};
const config = {
    cValue: (d: IIris) => d.species,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    height: 150 - margin.top - margin.bottom,
    width: 200 - margin.left - margin.right,
};

const xValue = (d: IIris, axis: string): number => getAxisValue(d, axis);
const xScale = d3.scaleLinear().range([0, config.width]);
const xAxis = d3.axisBottom(xScale);
export const xMap = (d: IIris, axis: string) => xScale(xValue(d, axis));

// setup y
const yValue = (d: IIris, axis: string): number => getAxisValue(d, axis);
const yScale = d3.scaleLinear().range([config.height, 0]);
const yAxis = d3.axisLeft(yScale);
export const yMap = (d: IIris, axis: string) => yScale(yValue(d, axis));

const tooltip = d3.select("div").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

export const getSvg = () => {
    const svg = d3.select("div").append("svg")
            .attr("width", config.width + margin.left + margin.right)
            .attr("height", config.height + margin.top + margin.bottom)
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
                        irises: IIris[], x: string, y: string) => {
    const minx = d3.min(irises, (d) => xValue(d, x)) || 0;
    const maxx = d3.max(irises, (d) => xValue(d, x)) || 0;
    const miny = d3.min(irises, (d) => yValue(d, y)) || 0;
    const maxy = d3.max(irises, (d) => yValue(d, y)) || 0;
    xScale.domain([minx - 1, maxx + 1]);
    yScale.domain([miny - 1, maxy + 1]);

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
        tooltip.html(d.species + "<br/> (" + xValue(d, x) + ", " + yValue(d, y) + ")")
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
                         x: string, y: string, send: (msg: string) => void) => {
    const brush = d3.brush()
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
