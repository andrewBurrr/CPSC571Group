import {interpolateHslLong, range, scaleBand, scaleLinear, scaleOrdinal, hsl, max} from 'd3';
import {BASE_COLORS, EMOTION_MAP} from "../constants";

const generateGradient = (baseColor, length) => {
    // Convert the base color to HSL
    const hslColor = hsl(baseColor);

    // Increase the lightness of the base color by 5%
    hslColor.l += 0.05;

    // Make sure the lightness value is between 0 and 1
    hslColor.l = Math.min(hslColor.l, 1);

    // Convert the HSL color back to a string
    const lightColor = hslColor.toString();

    return range(0, length).map(i => {
        return interpolateHslLong(lightColor, 'white')(i / length - 1);
    });
}

const createColorScale = () => {
    const colorScales = {}
    for (const category in EMOTION_MAP) {
        const length = EMOTION_MAP[category].length;
        const baseColor = BASE_COLORS[category];
        const gradient = generateGradient(baseColor, length);

        colorScales[category] = scaleOrdinal()
            .domain(EMOTION_MAP[category].map(d => Object.keys(d)[0]))
            .range(gradient);
    }
    return colorScales;
}

const createXScale = (data, width) => {
    return scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);
}

const createYScale = (data, height) => {
    const maxScore = max(data, d => d.score);
    return scaleLinear()
        .domain([0, maxScore])
        .nice()
        .range([height, 0]);
}

export { createXScale, createYScale, createColorScale };