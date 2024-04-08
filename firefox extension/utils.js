import { loadData } from "./chart/data";

/**
 * Check if the mouse is over the button or hover card
 * @param {MouseEvent} event - The mouse event
 * @returns {boolean} - Whether the mouse is over the button or hover card
 */
const isMouseOverButtonOrHoverCard = (event) => {
    return event.target = event.relatedTarget || event.target.contains(event.relatedTarget);
}

/**
 * Handle the click event of the button
 * @param {MouseEvent} event - The click event
 * @returns {Promise<void>} - The promise
 */
const handleClick = async (event) => {
    let username = event.target.parentNode.querySelector('div[slot="commentMeta"] a[href^="/user/"]');
    try {
        loadData(`http://localhost:8000/recent-comments/?username=${username.innerText}`).then(data => {
            console.log(data);
        });

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

        event.target.innerText = 'Done';

    } catch (error) {
        console.error(error);
    }
}