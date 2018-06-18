import * as d3 from "d3";
import { IIris } from "./iris";

export const margin = {
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

export const getSvg = (xAxis: any, yAxis: any) => {
    const svg = d3.select("div").append("svg")
            .attr("width", config.width + margin.left + margin.right)
            .attr("height", config.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // x-axis
    svg.append("g")
    .attr("transform", "translate(0," + config.height + ")")
    .attr("class", "x axis").call(xAxis).append("text")
    .attr("class", "label").attr("x", config.width).attr("y", -6)
    .style("text-anchor", "end").text("X");

    // y-axis
    svg.append("g")
    .attr("class", "y axis").call(yAxis).append("text").attr("class", "label")
    .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em")
    .style("text-anchor", "end").text("Y");
    return svg;
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
