import { isMouseOverButtonOrHoverCard } from './utils.js';

/**
 * Creates a <style> element with the provided CSS string data and appends it to the document head.
 * @param {string} style - The CSS styles to apply
 */
const createStyleElement = (style) => {
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
}

/**
 * Creates a hover card element with event listeners for mouseover and mouseout events.
 * @returns {HTMLDivElement} - The created hover card element.
 */
const createHoverCardElement = () => {
    const hoverCard = document.createElement('div');
    hoverCard.className = 'my-hover-card';

    hoverCard.addEventListener('mouseleave', () => {
        setTimeout(() => {
            hoverCard.style.display = 'none';
        }, 300);
    });

    return hoverCard;
}

/**
 * Creates a button element with the provided username and click event listener.
 * @param {HTMLElement} userComment - The parent element containing the username
 * @param {function} onClick - The click event listener for the button
 */
const createButtonElement = (userComment, onClick) => {
    const button = document.createElement('button');
    button.className = 'my-button';
    button.innerText = 'Fetch Score';
    button.addEventListener('click', onClick, { once: true });

    userComment.parentNode.insertBefore(button, userComment.nextSibling);
}

export { createStyleElement, createHoverCardElement, createButtonElement };