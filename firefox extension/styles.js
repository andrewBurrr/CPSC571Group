/**
 * CSS styles for custom button
 * @type {string}
 */
const buttonStyle = `
    .my-button {
        background-color: #1D282D;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        margin: 1ch 1ch;
        padding-left: 2ch;
        padding-right: 2ch;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 999px;
        cursor: pointer;
        text-content: 'fetch score';
    }
    
    .my-button:hover {
        background-color: #32464b;
    }
`;

/**
 * CSS styles for custom hover card
 * @type {string}
 */
const hoverCardStyle = `
    .my-hover-card {
        background-color: #111a1c;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        margin: 1ch 1ch;
        padding-left: 2ch;
        padding-right: 2ch;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 1rem;
        position: absolute;
        width: auto;
        height: auto;
        display: none;
        z-index: 1;
        transition: display 1s ease-in-out;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3);
    }        
`;

export { buttonStyle, hoverCardStyle };