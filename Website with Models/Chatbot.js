const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook";

// Function to clean markdown syntax from the bot's response
function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic (*text*)
    .replace(/`(.*?)`/g, '$1')       // Remove code (`text`)
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Remove links ([text](url))
}

// Function to send user inputs to RASA and receive bot response
async function sendMessageToRasa(message) {
    try {
        const response = await fetch(RASA_SERVER_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: message, sender: "user"})
        });

        if (!response.ok){
            throw new Error("Failed to fetch response from Rasa");
        }

        const data = await response.json();
        console.log("Rasa Response:", data); 
        return data.length ? data[0].text : "Sorry, I didn't understand that.";
    } catch (error) {
        console.error("Error:", error);
        return "An error occurred. Please try again.";
    }
}

// Function to add message to the chat 
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

// Function to handle user input
async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage){
        addMessage(userMessage, true);
        userInput.value = ''; // Clear the input field

        // Disable the send button and the input field to prevent multiple messages sent while the bot responds
        sendButton.disabled = true;
        userInput.disabled = true;

        try {
             const botMessage = await sendMessageToRasa(userMessage);
             addMessage(cleanMarkdown(botMessage), false); // Clean markdown syntax from the bot's response
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