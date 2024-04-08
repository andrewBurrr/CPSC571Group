import { scaleBand, scaleLinear } from 'd3';
const createXScale = (data, width) => {
    return scaleBand()
        .domain(data.map(d => d.comment_id))
        .range([0, width])
        .padding(0.1);
}

const createYScale = (data, height) => {
    return scaleLinear()
        .domain([0, d3.max(data, d => d.score)])
        .range([height, 0]);
}

export { createXScale, createYScale };