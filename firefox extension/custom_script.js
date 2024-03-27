// Create a style element
const style = document.createElement('extensionStyle');
// Set the CSS code for the button
extensionStyle.textContent = `
    .my-button {
        background-color: grey; /* Green */
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 2ch 2ch;
        padding-left: 2ch;
        padding-right: 2ch;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 12px;
        cursor: pointer;
        text-content: 'fetch score';
    }
`;
// Append the style element to the head of the document
document.head.appendChild(extensionStyle);


// Select all elements by their data-testid attribute
const usernames = document.querySelectorAll('[data-testid="comment_author_link"]');
usernames.forEach(username => {
    const href = username.getAttribute('href'); // Get the href attribute
    const button = document.createElement('button');
    // button.textContent = 'fetch score';
    button.className = 'my-button';
    // button.id = href;
    button.addEventListener('click', async () => {
        const href = username.getAttribute('href'); // Get the href attribute
        button.textContent = `Score: ${href}`;
        console.log(href); // Log the href attribute
    });
    username.parentNode.insertBefore(button, username.nextSibling);
});

// // Select all elements by their data-testid attribute
// const usernames = document.querySelectorAll('[data-testid="comment_author_link"]');
// usernames.forEach(username => {
//     const button = document.createElement('button');
//     button.textContent = 'fetch score';
//     button.className = 'my-button';
//     button.addEventListener('click', async () => {
//         try {
//             const response = await fetch('https://localhost:8000/api/score'); // Replace with your API URL
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const score = await response.text(); // Use .json() if the response is JSON
//             button.textContent = `Score: ${score}`;
//         } catch (error) {
//             console.error('Fetch failed: ', error);
//         }
//     });
//     username.parentNode.insertBefore(button, username.nextSibling);
// });