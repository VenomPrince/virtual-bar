// Global variables
let orderTimer;
let recommendationTimer;
let userName = '';
let typingSpeed = 50;
let player;

// Butler's phrases
const butlerPhrases = [
    // Philosophical quotes
    "Time is not a measure of movement but rather movement a measure of time. - Aristotle",
    "The only true wisdom is in knowing you know nothing. - Socrates",
    "Everything flows, nothing stands still. - Heraclitus",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
    
    // Bar atmosphere
    "The jazz melody whispers stories of forgotten nights...",
    "In the depths of this glass, memories dance like stars.",
    "Silence is sometimes the best companion.",
    "The night holds secrets that only time will tell.",
    
    // Mysterious messages (including scrambled ones)
    "Eyox ucsreh loLlreetmnlotyn . cShoodiac ew,i lSlt rbaen greera.d yY osuhro rLtelmyo.n Soda will be ready shortly.",
    "T1m3 fl0w5 d1ff3r3ntly 1n th15 pl4c3...",
    "In the corner of your eye, shadows seem to dance.",
    "Reality is merely an illusion, albeit a very persistent one.",
    
    // Drink-related wisdom
    "Every drink tells a story, what will yours be?",
    "The perfect drink is not made, it is discovered.",
    "Sometimes the simplest choice is the most profound.",
    
    // Deep thoughts
    "Between the infinite and the finite, we find ourselves here.",
    "What is real? How do you define real?",
    "The universe is not only stranger than we imagine, it is stranger than we can imagine.",
    "In the end, we are all just stardust dreaming."
];

// Chat functionality
const randomNames = [
    "MoonlightDreamer", "NightOwl", "WhisperingShadow", "StarGazer", "MidnightRider",
    "DuskWanderer", "NeonPhantom", "TwilightSoul", "EchoingVoid", "CrimsonDawn",
    "MysticWanderer", "VelvetShadow", "AstralDrifter", "SilentStorm", "EmberGlow"
];

const randomMessages = [
    "This place never ceases to amaze me...",
    "The music tonight is perfect",
    "Anyone tried the Virtual Sunrise?",
    "Digital Martini hits different here",
    "Love the atmosphere",
    "Time feels different in here",
    "Who's up for a philosophical discussion?",
    "The void welcomes us all",
    "Another night of infinite possibilities",
    "The pixels taste better in the dark",
    "Has anyone seen my digital reflection?",
    "The code flows like wine here",
    "Reality is just a suggestion",
    "The matrix has good drinks",
    "Binary dreams and quantum drinks"
];

let onlineCount = Math.floor(Math.random() * 10) + 8; // Random number between 8-17

function updateOnlineCount() {
    const change = Math.random() < 0.5 ? -1 : 1;
    onlineCount = Math.max(5, Math.min(20, onlineCount + change));
    document.querySelector('.online-count').textContent = `${onlineCount} strangers here`;
}

function addChatMessage(username, message, isJoin = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = isJoin ? 'chat-message join' : 'chat-message';
    
    if (isJoin) {
        messageDiv.textContent = `${username} has joined the bar`;
    } else {
        const usernameDiv = document.createElement('div');
        usernameDiv.className = 'username';
        usernameDiv.textContent = username;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.textContent = message;
        
        messageDiv.appendChild(usernameDiv);
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateChat() {
    // Random chat message every 5-15 seconds
    function sendRandomMessage() {
        const username = randomNames[Math.floor(Math.random() * randomNames.length)];
        const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        addChatMessage(username, message);
        
        const nextDelay = Math.floor(Math.random() * (15000 - 5000 + 1) + 5000);
        setTimeout(sendRandomMessage, nextDelay);
    }
    
    // Simulate people joining every 10-30 seconds
    function simulateJoin() {
        const username = randomNames[Math.floor(Math.random() * randomNames.length)];
        addChatMessage(username, null, true);
        updateOnlineCount();
        
        const nextDelay = Math.floor(Math.random() * (30000 - 10000 + 1) + 10000);
        setTimeout(simulateJoin, nextDelay);
    }
    
    // Start simulations
    setTimeout(sendRandomMessage, 2000);
    setTimeout(simulateJoin, 5000);
    
    // Update online count periodically
    setInterval(updateOnlineCount, 10000);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(userName || 'You', message);
        input.value = '';
    }
}

// YouTube Player setup
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const volumeSlider = document.getElementById('volume');
    player.setVolume(volumeSlider.value);
    
    // Update volume when slider changes
    volumeSlider.addEventListener('input', (e) => {
        player.setVolume(e.target.value);
    });
}

function onPlayerStateChange(event) {
    // If video ends, replay it
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

// Typing animation
function typeText(element, text) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }
    
    type();
}

// Enter the bar
function enterBar() {
    const nameInput = document.getElementById('guestName');
    userName = nameInput.value.trim() || 'Stranger';
    document.getElementById('displayName').textContent = userName;
    
    // Transition
    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        showButlerMessage(`Welcome to the void, ${userName}. What echoes shall we create tonight?`);
        
        // Start video and butler chat
        if (player && player.playVideo) {
            player.playVideo();
        }
        startRandomButlerChat();
    }, 500);
    
    // Start timer
    startOrderTimer();
}

// Timer functions
function startOrderTimer() {
    let timeLeft = 60;
    updateTimer(timeLeft);
    
    orderTimer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        
        if (timeLeft === 45) {
            startRecommendationTimer();
        }
        
        if (timeLeft <= 0) {
            clearInterval(orderTimer);
            showButlerMessage(`${userName}, would you like a recommendation?`);
        }
    }, 1000);
}

function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startRecommendationTimer() {
    recommendationTimer = setInterval(() => {
        const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
        showButlerMessage(randomRecommendation);
    }, 15000);
}

// Start random butler chat
function startRandomButlerChat() {
    function showRandomMessage() {
        const randomPhrase = butlerPhrases[Math.floor(Math.random() * butlerPhrases.length)];
        showButlerMessage(randomPhrase);
        
        // Set next message timer (random between 20-40 seconds)
        const nextMessageDelay = Math.floor(Math.random() * (40000 - 20000 + 1) + 20000);
        setTimeout(showRandomMessage, nextMessageDelay);
    }
    
    // Start the first message after a longer delay
    setTimeout(showRandomMessage, 10000);
}

// Drink selection
function selectDrink(drink) {
    clearInterval(orderTimer);
    clearInterval(recommendationTimer);
    showButlerMessage(`Excellent choice, ${userName}. Your ${drink} will be ready shortly.`);
    document.getElementById('timer').textContent = "Ordered";
}

function orderCustomDrink() {
    const customDrink = document.getElementById('customDrink').value.trim();
    if (customDrink) {
        selectDrink(customDrink);
        document.getElementById('customDrink').value = '';
    }
}

// Butler message display
function showButlerMessage(message) {
    const butlerMessage = document.getElementById('butlerMessage').querySelector('.typing-text');
    typeText(butlerMessage, message);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Start chat simulation after a short delay
    setTimeout(simulateChat, 1000);
});

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
