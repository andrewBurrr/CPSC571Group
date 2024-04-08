import { EMOJI_MAP } from './constants.js';
import { buttonStyle, hoverCardStyle } from './styles.js';
import { loadData } from "./chart/data";
import { createChart } from "./chart/chart";

/**
 * Handle the click event of the button
 * @param event
 * @returns {Promise<void>}
 */
async function handleClick(event) {
    if (event.target.innerText !== 'Fetch Score') return;
    const username = event.target.parentNode.querySelector('div[slot="commentMeta"] a[href^="/user/"]');
    if (!username) return;
    event.target.disabled = true;

    let chart = null;

    try {
        // use loadData
        loadData(`http://localhost:8000/recent-comments/?username=${username.innerText}`).then(data => {
            chart = createChart(null, data, 400, 400);
        });
        const response = await fetch(`http://localhost:8000/recent-comments/?username=${username.innerText}`);
        if (response.ok) {
            const data = await response.json();
            const comments = data.comments;
            let averages = [];
            let highestLabel = '';
            let highestScore = 0;
            comments.forEach( comment => {
                console.log("comment:", comment.comment);
                let filteredScores = comment.scores.filter( score => score.score >= 0.3);
                let averageScore = filteredScores.reduce((acc, curr) => acc + curr.score, 0) / filteredScores.length;
                averages.push(averageScore);
                comment.scores.forEach( score => {
                    if (score.score > highestScore) {
                        highestScore = score.score;
                        highestLabel = score.label;
                    }
                });
            });
            let totalAverage = averages.reduce((acc, curr) => acc + curr, 0) / averages.length;
            let emojiText = '';
            for (let [label, emoji] of Object.entries(EMOJI_MAP)) {
                if (averages[label] >= totalAverage) {
                    emojiText += emoji + ', ';
                }
            }
            if (emojiText.endsWith(', ')) {
                emojiText = emojiText.slice(0, -2);
            }

            if (emojiText === '') {
                emojiText = EMOJI_MAP[highestLabel];
            }
            event.target.innerText = emojiText;

            const hoverCard = createHoverCardElement();
            event.target.appendChild(hoverCard);

            event.target.addEventListener('mouseover', () => {
                hoverCard.style.display = 'flex';
            });

            event.target.addEventListener('mouseout', () => {
                if (!isMouseOverButtonOrHoverCard(event)) {
                    hoverCard.style.display = 'none';
                }
            });

        } else {
            console.error('Failed to fetch data');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        event.target.disabled = false;
    }
}

// Apply button and hover card styles to the document head
createStyleElement(buttonStyle);
createStyleElement(hoverCardStyle);

// Find all usernames on the page and create a button for each
const usernames = document.querySelectorAll('div[slot="commentMeta"] div[class^="flex items-center pr-xs overflow-hidden"]');
usernames.forEach(username => {
    createButtonElement(username, handleClick);
});
