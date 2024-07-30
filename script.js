// Game variables
let score = 0;
let timer = 180;
let interval;
let revealedCards = [];
let matchedPairs = 0;
const totalPairs = 5;
let soundsEnabled = true;
let isPaused = false;

// Card setup
const cardIds = [
    'card-0', 'card-1', 'card-2', 'card-3', 'card-4',
    'card-5', 'card-6', 'card-7', 'card-8', 'card-9'
];

// UI elements
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const exitButton = document.getElementById('exit');
const muteButton = document.getElementById('mute');

// Initialize cards and add them to the scene
function initCards() {
    const cards = cardIds.map(id => document.getElementById(id));
    cards.forEach((card, index) => {
        if (!card) {
            console.error(`Card with ID ${cardIds[index]} not found.`);
        }
        card.userData = { id: Math.floor(index / 2), revealed: false }; // Assign userData
    });
    shuffleArray(cards); // Shuffle the array to randomize placement
    positionCardsInGrid(cards); // Position cards in a grid
}

// Shuffle the array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Position cards in a grid on the tabletop
function positionCardsInGrid(cards) {
    const rows = 2;
    const cols = totalPairs; // 5 pairs, 10 cards in total
    const spacing = 1.2; // Reduced spacing between cards

    cards.forEach((card, index) => {
        if (!card) return; // Skip if card is null
        const row = Math.floor(index / cols);
        const col = index % cols;
        const position = {
            x: (col - (cols / 2)) * spacing,
            y: (row - (rows / 2)) * spacing,
            z: 0
        };
        card.setAttribute('data-position', `${position.x} ${position.y} ${position.z}`);
    });
}

// Reveal a card
function revealCard(card) {
    console.log(`Revealing card: ${card.id}`);
    if (revealedCards.length < 2 && !card.userData.revealed) {
        card.object3D.rotation.y = Math.PI / 2;
        card.userData.revealed = true;
        revealedCards.push(card);
        playSound('flip');
        if (revealedCards.length === 2) {
            setTimeout(checkMatch, 5000);
        }
    }
}

// Hide a card
function hideCard(card) {
    card.object3D.rotation.y = 0;
    card.userData.revealed = false;
}

// Check for a match
function checkMatch() {
    if (revealedCards.length === 2) {
        if (revealedCards[0].userData.id === revealedCards[1].userData.id) {
            score++;
            matchedPairs++;
            playSound('match');
            revealedCards.forEach(card => card.object3D.visible = false);
            if (matchedPairs === totalPairs) {
                winGame();
            }
        } else {
            revealedCards.forEach(card => hideCard(card));
            playSound('mismatch');
        }
        revealedCards = [];
        updateScore();
    }
}

// Update score UI
function updateScore() {
    scoreElement.innerText = `Score: ${score}`;
}

// Update timer UI
function updateTimer() {
    timerElement.innerText = `Time: ${timer}s`;
}

// Game win logic
function winGame() {
    clearInterval(interval);
    alert('You win! Start over?');
    startGame();
}

// Game over logic
function gameOver() {
    clearInterval(interval);
    alert('Time\'s up! Start over?');
    startGame();
}

// Start the game
function startGame() {
    score = 0;
    timer = 180;
    matchedPairs = 0;
    revealedCards = [];
    updateScore();
    updateTimer();
    clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused) {
            timer--;
            updateTimer();
            if (timer <= 0) {
                gameOver();
            }
        }
    }, 1000);
    initCards();
}

// Play sound
function playSound(type) {
    if (soundsEnabled) {
        const audio = new Audio(`sounds/${type}.mp3`);
        audio.play();
    }
}

// Pause game
function pauseGame() {
    isPaused = !isPaused;
}

// Exit game
function exitGame() {
    clearInterval(interval);
    // Additional logic to exit the game
}

// Toggle sound
function toggleSound() {
    soundsEnabled = !soundsEnabled;
}

// Card click handler
function onCardClick(cardId) {
    console.log(`Card clicked: ${cardId}`);
    const card = document.getElementById(cardId);
    if (card) {
        revealCard(card);
    } else {
        console.error(`Card with ID ${cardId} not found.`);
    }
}

const App = {
    startGame,
    pauseGame,
    exitGame,
    toggleSound,
    onCardClick
};

// Start the game initially
document.addEventListener('DOMContentLoaded', startGame);

export { App };
