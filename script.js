const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');
let username;

// Load messages from localStorage
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => appendMessage(msg));
}

// Save messages to localStorage
function saveMessage(msg) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(msg);
    if (messages.length > 100) {
        messages.shift(); // Keep only the last 100 messages
    }
    localStorage.setItem('messages', JSON.stringify(messages));
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
sendButton.onclick = () => {
    const message = messageInput.value;
    if (message) {
        const msgObj = { user: username, text: message };
        saveMessage(msgObj);
        appendMessage(msgObj);
        messageInput.value = '';
        typingIndicator.style.display = 'none'; // Hide typing indicator after sending
    }
};

// Show typing indicator
messageInput.addEventListener('input', () => {
    typingIndicator.textContent = `${username} is typing...`;
    typingIndicator.style.display = 'block';
});

// Hide typing indicator
messageInput.addEventListener('blur', () => {
    typingIndicator.style.display = 'none';
});

// Listen for storage events to update messages in other tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'messages') {
        const messages = JSON.parse(event.newValue);
        chatBox.innerHTML = ''; // Clear chat box
        messages.forEach(msg => appendMessage(msg));
    }
});

function appendMessage(data) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = `${data.user}: ${data.text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Update storage when new messages are sent
sendButton.onclick = () => {
    const message = messageInput.value;
    if (message) {
        const msgObj = { user: username, text: message };
        saveMessage(msgObj);
        
        // Trigger storage event for other tabs
        localStorage.setItem('messages', JSON.stringify(JSON.parse(localStorage.getItem('messages')) || []).concat(msgObj));
        
        appendMessage(msgObj);
        messageInput.value = '';
        typingIndicator.style.display = 'none'; // Hide typing indicator after sending
    }
};

