import { axisBottom, axisLeft } from 'd3';

const createXaxis = (xScale) => {
    return axisBottom(xScale);
}

const createYaxis = (yScale, width) => {
    return axisLeft(yScale)
        .tickSize(-width)
        .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1.0]);
}

export { createXaxis, createYaxis };