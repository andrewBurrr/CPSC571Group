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
        margin-top: 1ch;
        padding: 3ch 3ch;
        border-radius: 1rem;
        position: absolute;
        display: none;
        width: auto;
        height: auto;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .my-hover-card:hover {
        opacity: 1;
    }
    
    .animate-opacity {
        animation: fadeIn 0.3s ease forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const tooltipStyle = `
    .my-tooltip {
        background-color: #111a1c;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        margin-top: 1ch;
        padding: 1ch 1ch;
        border-radius: 1rem;
        position: absolute;
        width: auto;
        height: auto;
        display: flex;
        z-index: 2;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3);
    }
`;

export { buttonStyle, hoverCardStyle, tooltipStyle };