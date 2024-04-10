import {buttonStyle, hoverCardStyle, tooltipStyle} from './styles.js';
import { createStyleElement, createButtonElement } from './elements.js';
import { handleClick } from './utils.js';

// Apply button and hover card styles to the document head
createStyleElement(buttonStyle);
createStyleElement(hoverCardStyle);
createStyleElement(tooltipStyle);

// Find all usernames on the page and create a button for each
const userComments = document.querySelectorAll('div[slot="commentMeta"] div[class^="flex items-center pr-xs overflow-hidden"]');
userComments.forEach(comment => {
    createButtonElement(comment, handleClick);
});
