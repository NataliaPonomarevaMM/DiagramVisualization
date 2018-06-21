import * as d3 from "d3";
import { Event, IMessage} from "../data.service";
import { IIris } from "../iris";

const margin = {
    bottom: 30,
    left: 40,
    right: 10,
    top: 5,
};

const cValue = (d: IIris) => d.species;
const color = d3.scaleOrdinal(d3.schemeCategory10);
let height = 150 - margin.top - margin.bottom;
let width = 200 - margin.left - margin.right;

export const getSvg = (id: number) => {
    const selection = d3.selectAll("plot").filter((d, i) => i === id);

    const svg = selection.select("div").classed("svg-container", true)
        .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 300 200")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const rect = (selection.node() as Element).getBoundingClientRect();
    width = rect.width - margin.left - margin.right;
    height = rect.width * 3 / 4 - margin.top - margin.bottom;

    return svg;
};

export const configureAxis = (svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
                              irises: IIris[], x: string, y: string) => {
    const xValue = (d: IIris, axis: string): number => getAxisValue(d, axis);
    const xScale = d3.scaleLinear().range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    const xMap = (d: IIris, axis: string) => xScale(xValue(d, axis));

    const yValue = (d: IIris, axis: string): number => getAxisValue(d, axis);
    const yScale = d3.scaleLinear().range([height, 0]);
    const yAxis = d3.axisLeft(yScale);
    const yMap = (d: IIris, axis: string) => yScale(yValue(d, axis));

    const minx = d3.min(irises, (d) => xValue(d, x)) || 0;
    const maxx = d3.max(irises, (d) => xValue(d, x)) || 0;
    const miny = d3.min(irises, (d) => yValue(d, y)) || 0;
    const maxy = d3.max(irises, (d) => yValue(d, y)) || 0;
    xScale.domain([minx - 1, maxx + 1]);
    yScale.domain([miny - 1, maxy + 1]);

    svg.append<SVGGElement>("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis").call(xAxis).append("text")
    .attr("font-size", "8px")
    .attr("class", "label").attr("x", width).attr("y", -6)
    .style("text-anchor", "end").text("X");

    svg.append<SVGGElement>("g")
    .attr("class", "y axis").call(yAxis).append("text")
    .attr("font-size", "8px").attr("class", "label")
    .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em")
    .style("text-anchor", "end").text("Y");
    return { xMap, yMap };
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
        .style("fill", (d: IIris) => color(cValue(d)))
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

export const setBrush = (data: d3.Selection<d3.BaseType, IIris, d3.BaseType, {}>,
                         x: string, y: string, send: (msg: IMessage) => void,
                         plotId: number,
                         xMap: (d: IIris, axis: string) => number,
                         yMap: (d: IIris, axis: string) => number) => {
    return  d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start", () => {
                if (d3.event.selection != null) {
                    if (d3.event.selection[0][0] === d3.event.selection[1][0] &&
                        d3.event.selection[0][1] === d3.event.selection[1][1]) {
                            send({event: Event.Stop});
                    } else {
                            send({event: Event.Start, id: plotId.toString()});
                    }
                }
            })
            .on("brush", () => {
                if (d3.event.selection != null) {
                    send({event: Event.Start, id: plotId.toString()});
                    data.each((d) => {
                        if (xMap(d, x) >= d3.event.selection[0][0] &&
                            xMap(d, x) <= d3.event.selection[1][0] &&
                            yMap(d, y) >= d3.event.selection[0][1] &&
                            yMap(d, y) <= d3.event.selection[1][1]) {
                                send({event: Event.Continue, id: d.id});
                        }
                    });
                }
            });
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

export const getIndex = (str: string): number => {
    switch (str) {
    case "sepalLength":
        return 0;
    case "sepalWidth":
        return 1;
    case "petalLength":
        return 2;
    case "petalWidth":
        return 3;
    default:
        return 0;
    }
};
