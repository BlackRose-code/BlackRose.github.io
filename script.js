const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');
let username;

// Load messages from the server
async function loadMessages() {
    const response = await fetch('http://localhost:3000/messages');
    const messages = await response.json();
    messages.forEach(msg => appendMessage(msg));
}

// Handle user login
document.getElementById('login-button').onclick = () => {
    username = document.getElementById('nickname-input').value;
    if (username) {
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        loadMessages();
    }
};

// Handle sending messages
sendButton.onclick = async () => {
    const message = messageInput.value;
    if (message) {
        const msgObj = { user: username, text: message };
        await fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msgObj)
        });
        appendMessage(msgObj);
        messageInput.value = '';
    }
};

function appendMessage(data) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = `${data.user}: ${data.text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}


