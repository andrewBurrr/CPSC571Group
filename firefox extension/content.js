const EMOJI_MAP = {
    'admiration': '👏',
    'amusement': '😂',
    'anger': '😡',
    'annoyance': '😒',
    'approval': '👍',
    'caring': '🤗',
    'confusion': '😕',
    'curiosity': '🤔',
    'desire': '😍',
    'disappointment': '😞',
    'disapproval': '👎',
    'disgust': '🤮',
    'embarrassment': '😳',
    'excitement': '🤩',
    'fear': '😨',
    'gratitude': '🙏',
    'grief': '😢',
    'joy': '😃',
    'love': '❤️',
    'nervousness': '😬',
    'optimism': '🤞',
    'pride': '😌',
    'realization': '💡',
    'relief': '😅',
    'remorse': '😞',
    'sadness': '😭',
    'surprise': '😲',
    'neutral': '😐',
};

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
`;

function createStyleElement(style) {
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
}

function createButtonElement(username, onClick) {
    const button = document.createElement('button');
    button.className = 'my-button';
    button.innerText = 'Fetch Score';
    button.addEventListener('click', onClick);
    username.parentNode.insertBefore(button, username.nextSibling);
}

/**
 * Handle the click event of the button
 * @param event
 * @returns {Promise<void>}
 */
async function handleClick(event) {
    const username = event.target.parentNode.querySelector('div[slot="commentMeta"] a[href^="/user/"]');
    if (!username) return;
    event.target.disabled = true;

    try {
        const response = await fetch(`http://localhost:8000/recent-comments/?username=${username.innerText}`);
        if (response.ok) {
            const data = await response.json();
            const comments = data.comments;
            comments.forEach( comment => {
                console.log("comment:", comment.comment);
                comment.scores.forEach( score => {
                    console.log(EMOJI_MAP[score.label], " ", score.score);
                });
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

createStyleElement(buttonStyle);

const usernames = document.querySelectorAll('div[slot="commentMeta"] div[class^="flex items-center pr-xs overflow-hidden"]');
usernames.forEach(username => {
    console.log("username");
    createButtonElement(username, handleClick);
});
