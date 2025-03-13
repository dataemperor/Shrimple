// Define the API key
const API_KEY = 'AIzaSyDmNxdBzUcTd-tR4_3_by48nr8QynaXlXM';
// Define the API URL
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to take user inputs and generate the responses from the API
async function generateResponse(prompt){
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok){
        throw new Error('Failed to generate response'); // Display an error mesaage if there is an error
    }

    const data = await response.json(); // Converts the API response to JSON format

    console.log(data);


    return data.candidates[0].content.parts[0].text; // Returns the first generated response form the API
}

function cleanMarkdown(text){
    return text
        .replace(/#{1,6}\s?/g, '') // Remove any Markdown headers  
        .replace(/\*\*/g, '') // Remove bold formatting
        .replace(/\n{3,}/g, '\n\n') // Limits excessive newlines to a maximum of two
        .trim(); // Remove any whitespace from the start and end of the string
}

function addMessage(message, isUser){
    const messageElement = document.createElement('div'); 
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'images/user.png' : 'images/bot.png';
    profileImage.alt = isUser ? 'User' : 'Bot';
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage){
        addMessage(userMessage, true);
        userInput.value = ''; // Clear the input field

        // Disable the send button an the input field to prevent multiple messages sent while the bot responds
        sendButton.disabled = true;
        userInput.disabled = true;

        try {
             const botMessage = await generateResponse(userMessage);
             addMessage(cleanMarkdown(botMessage), false);
        } catch (error){
            console.error('Error:', error);
            addMessage('Sorry. I encountered an error. Please try again.', false); // Display an error message when an error occurs
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});