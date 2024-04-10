import { EMOTION_MAP } from '../constants';
import {ascending, descending} from "d3";

const legendPosition = (d, i) => {
    const column = i % 2;
    const row = Math.floor(i / 2);
    return `translate(${column * 120}, ${row * 20})`;
}

let legend_sort = false;

const createLegend = (svg, data, colorScale, xScale, xAxis, width, height, margin, numColumns) => {
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);

    let yOffset = 20;

    for (const category in EMOTION_MAP) {
        const legendGroup = legend.append('g')
            .attr('class', 'legend-group')
            .attr('transform', `translate(0, ${yOffset})`);

        // Add category headers
        legendGroup.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', 'translate(0, -10)')
            .style('fill', 'white')
            .text(category);

        // Add legend items for each emotion within the category
        const emotionGroups = legendGroup.selectAll('.emotion-group')
            .data(EMOTION_MAP[category])
            .enter()
            .append('g')
            .attr('class', 'emotion-group')
            .attr('transform', legendPosition);

        emotionGroups.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => colorScale[category](Object.keys(d)[0]))
            .on('click', () => {
                legend_sort = !legend_sort;

                if (legend_sort) {
                    data.sort((a, b) => {
                        const aCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === a.label));
                        const bCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === b.label));

                        if (aCategory === category && bCategory === category) {
                            return descending(a.label, b.label);
                        } else if (aCategory === category) {
                            return -1;
                        } else if (bCategory === category) {
                            return 1;
                        } else {
                            const categoryComparison = ascending(aCategory, bCategory);
                            return categoryComparison !== 0 ? categoryComparison : ascending(a.label, b.label);
                        }

                    });
                } else {
                    data.sort((a, b) => {
                        const aCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === a.label));
                        const bCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === b.label));

                        if (aCategory === category && bCategory === category) {
                            return ascending(a.label, b.label);
                        } else if (aCategory === category) {
                            return -1;
                        } else if (bCategory === category) {
                            return 1;
                        } else {
                            const categoryComparison = ascending(aCategory, bCategory);
                            return categoryComparison !== 0 ? categoryComparison : ascending(a.label, b.label);
                        }
                    });
                }

                xScale.domain(data.map(d => d.label));

                const bars = svg.selectAll('.bar')

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

        emotionGroups.append('text')
            .attr('x', 15)
            .attr('y', 9)
            .style('fill', 'white')
            .text(d => Object.keys(d)[0]);

        yOffset += 25 * Math.ceil(EMOTION_MAP[category].length / numColumns);
    }
}

export { createLegend };