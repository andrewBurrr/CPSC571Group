import { select } from 'd3';
import { createXScale, createYScale } from './scales';
import { createXaxis, createYaxis } from './axes';

const createChart = (container, data, width, height) => {
    const svg = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scales
    const xScale = createXScale(data, width);
    const yScale = createYScale(data, height);

    // Create axes
    const xAxis = createXaxis(xScale);
    const yAxis = createYaxis(yScale);

    // Append axes
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    // Append bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.comment_id))
        .attr('y', d => yScale(d.score))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.score))
        .attr('fill', 'steelblue');

    return svg;
}

export { createChart };