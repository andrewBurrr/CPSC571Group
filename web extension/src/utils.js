import { loadData } from "./chart/data";
import { createHoverCardElement } from "./elements.js";
import {createChart} from "./chart/chart";
import { EMOTION_MAP } from "./constants.js";

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

/**
 * Check if the mouse is over the button or hover card
 * @param {MouseEvent} event - The mouse event
 * @returns {boolean} - Whether the mouse is over the button or hover card
 */
const isMouseOverButtonOrHoverCard = (event) => {
    return event.target === event.relatedTarget || event.target.contains(event.relatedTarget);
}

/**
 * Handle the click event of the button
 * @param {MouseEvent} event - The click event
 * @returns {Promise<void>} - The promise
 */
const handleClick = async (event) => {

    let username = event.target.parentNode.querySelector('div[slot="commentMeta"] a[href^="/user/"]');

    try {
        event.target.innerText = 'Done';

        const hoverCard = createHoverCardElement();

        const parentRect = event.target.parentNode.getBoundingClientRect();

        const rect = event.target.getBoundingClientRect();

        const style = window.getComputedStyle(event.target);
        const paddingLeft = parseFloat(style.getPropertyValue('padding-left'));

        hoverCard.style.top = `${rect.height + 20}px`;
        hoverCard.style.left = `${rect.left - parentRect.left + paddingLeft + 26}px`;
        event.target.parentNode.appendChild(hoverCard);

        loadData(`http://localhost:8000/recent-comments/?username=${username.innerText}`).then(data => {
            const threshold = 0.3;

            let selectedEmojis = [];

            for (const { label, score } of data) {
                let labelCategory;
                for ( const category in EMOTION_MAP) {
                    if (EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === label)) {
                        labelCategory = category;
                        break;
                    }
                }

                if (score >= threshold && labelCategory) {
                    selectedEmojis.push(EMOTION_MAP[labelCategory].find(emotion => Object.keys(emotion)[0] === label)[label]);
                }
            }

            if (selectedEmojis.length === 0) {
                const sortedScores = data.sort((a, b) => b.score - a.score);
                console.log(sortedScores);

                let highestLabel = sortedScores[0].label;
                let highestCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === highestLabel));

                selectedEmojis.push(EMOTION_MAP[highestCategory].find(emotion => Object.keys(emotion)[0] === highestLabel)[highestLabel]);

                const highestScore = sortedScores[0].score;
                for (let i = 1; i < sortedScores.length && selectedEmojis.length < 3; i++) {
                    if (sortedScores[i].score >= highestScore * 0.95) {
                        let nextHighestScoreLabel = sortedScores[i].label;
                        let nextHighestScoreCategory = Object.keys(EMOTION_MAP).find(category => EMOTION_MAP[category].some(emotion => Object.keys(emotion)[0] === nextHighestScoreLabel));
                        selectedEmojis.push(EMOTION_MAP[nextHighestScoreCategory].find(emotion => Object.keys(emotion)[0] === nextHighestScoreLabel)[nextHighestScoreLabel]);
                    } else {
                        break;
                    }
                }
            }

            event.target.innerText = selectedEmojis.join(' ');

            createChart(hoverCard, username.innerText, data, 600, 400);
        });

        event.target.addEventListener('mouseenter', () => {
            hoverCard.style.display = 'flex';
            hoverCard.classList.add('animate-opacity');
        });

    } catch (error) {
        console.error(error);
    }
}

export { handleClick, isMouseOverButtonOrHoverCard, toTitleCase };