import { useState } from "react";
import "./Chatbot.css";

const RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold (**text**)
      .replace(/\*(.*?)\*/g, "$1") // Remove italic (*text*)
      .replace(/`(.*?)`/g, "$1") // Remove code (`text`)
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1"); // Remove links ([text](url))
  };

  const sendMessageToRasa = async (message: string): Promise<string> => {
    try {
      const response = await fetch(RASA_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sender: "user" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from Rasa");
      }

      const data = await response.json();
      return data.length ? data[0].text : "Sorry, I didn't understand that.";
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred. Please try again.";
    }
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, isUser: true }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const botMessage = await sendMessageToRasa(userInput);
      setMessages((prev) => [...prev, { text: cleanMarkdown(botMessage), isUser: false }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error occurred, please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chatbot</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? "user-message" : "bot-message"}`}>
            <img
              className="profile-image"
              src={msg.isUser ? "images/user.png" : "images/bot.png"}
              alt={msg.isUser ? "User" : "Bot"}
            />
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleUserInput()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={handleUserInput} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;