import { select } from 'd3';
import { toTitleCase } from "../utils";

const tooltip = select('body').append('div')
    .attr('class', 'my-tooltip');

// Append elements to the tooltip for label and confidence
tooltip.append('div')
    .attr('class', 'tooltip-label')
    .style('font-weight', 'bold')
    .style('margin-bottom', '5px');

tooltip.append('div')
    .attr('class', 'tooltip-confidence')
    .style('color', '#888');

const showTooltip = (event, d) => {
    tooltip.transition()
        .duration(200)
        .style('opacity', 1);
    tooltip.html(`
        <div>
            <strong>${toTitleCase(d.label)}</strong>
            <br>
            <strong>Confidence:</strong> ${parseFloat(d.score).toFixed(2)}
        </div>
        `)
        .style('left', `${event.pageX - 12}px`)
        .style('top', `${event.pageY + 25}px`);
}

const hideTooltip = () => {
    tooltip.transition()
        .duration(500)
        .style('opacity', 0);
}

export { showTooltip, hideTooltip };