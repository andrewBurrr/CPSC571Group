import { axisBottom, axisLeft } from 'd3';

const createXaxis = (xScale) => {
    return axisBottom(xScale);
}

const createYaxis = (yScale) => {
    return axisLeft(yScale);
}

export { createXaxis, createYaxis };