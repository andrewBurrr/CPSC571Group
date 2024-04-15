import { select, ascending, descending } from 'd3';
import { createXScale, createYScale, createColorScale } from './scales';
import { createXaxis, createYaxis } from './axes';
import {EMOTION_MAP} from "../constants";
import {createLegend} from "./legend";
import {showTooltip, hideTooltip} from "./tooltip";

let sort_data = false;

const createChart = (container, username, data, width, height) => {
    // Define the chart area
    const margin = { top: 30, right: 260, bottom: 90, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('fill', 'white')
        .text(`${username}\'s 10 Recent Comments Summary`);


    // Create scales
    const xScale = createXScale(data, innerWidth);
    const yScale = createYScale(data, innerHeight);
    const colorScale = createColorScale();

    // Create axes
    const xAxis = createXaxis(xScale);
    const yAxis = createYaxis(yScale, innerWidth);

    // Append axes
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('dx', '-1em')
        .attr('dy', `${-xScale.bandwidth() / 2}px`)
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', margin.bottom)
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .text('Emotion');

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left / 2)
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .text('Confidence');

    svg.selectAll('.tick')
        .selectAll('line')
        .style('stroke', '#444444')
        .style('stroke-width', '1px');


    // Append data bars
    const bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => margin.left + xScale(d.label))
        .attr('y', d => margin.top + yScale(+d.score))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(0) - yScale(+d.score))
        .attr('fill', d => {
            let category;
            if (EMOTION_MAP['positive'].find(emotion => emotion[d.label])) {
                category = 'positive';
            } else if (EMOTION_MAP['negative'].find(emotion => emotion[d.label])) {
                category = 'negative';
            } else {
                category = 'neutral';
            }
            return colorScale[category](d.label);
        })
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip)
        .on('click', function() {
            // Toggle the sort state
            sort_data = !sort_data;

            if (sort_data) {
                // Sort the data by score
                data.sort((a, b) => descending(a.score, b.score));
            } else {
                // Sort the data by label
                data.sort((a, b) => ascending(a.label, b.label));
            }

            // Update the x-axis domain and transition the bars
            xScale.domain(data.map(d => d.label));

            bars.transition()
                .duration(1000)
                .attr('x', d => margin.left + xScale(d.label));

            svg.select('g')
                .transition()
                .duration(1000)
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('dx', '-1em')
                .attr('dy', `${-xScale.bandwidth() / 2}px`);
        });

    createLegend(svg, data, colorScale, xScale, xAxis, width, height, margin, 2);

    return svg;
}

export { createChart };