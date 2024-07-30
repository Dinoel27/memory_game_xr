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
const cards = [];
const models = [
    'model1.glb', 'model2.glb', 'model3.glb', 'model4.glb', 'model5.glb'
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
    const selectedModels = models.concat(models); // Duplicate the array
    shuffleArray(selectedModels); // Shuffle the array to randomize placement
    
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Clear previous cards if any

    for (let i = 0; i < selectedModels.length; i++) {
        const card = document.createElement('mr-model');
        card.setAttribute('src', `./models/${selectedModels[i]}`);
        card.setAttribute('data-id', i.toString());
        card.addEventListener('click', onCardClick);
        card.userData = { id: Math.floor(i / 2), revealed: false };
        cards.push(card);
        cardsContainer.appendChild(card);
    }
    positionCardsRandomly();
}

// Shuffle the array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Position cards randomly on the tabletop
function positionCardsRandomly() {
    const positions = [];
    cards.forEach(card => {
        let position;
        do {
            position = {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
                z: 0
            };
        } while (positions.some(pos => distance(pos, position) < 1.5));
        positions.push(position);
        card.setAttribute('data-position', `${position.x} ${position.y} ${position.z}`);
    });
}

// Calculate distance between two points
function distance(pos1, pos2) {
    return Math.sqrt(
        (pos1.x - pos2.x) ** 2 +
        (pos1.y - pos2.y) ** 2 +
        (pos1.z - pos2.z) ** 2
    );
}

// Reveal a card
function revealCard(card) {
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
            revealedCards.forEach(card => {
                card.object3D.rotation.y = 0;
                card.userData.revealed = false;
            });
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

// UI event listeners
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', () => { isPaused = !isPaused; });
exitButton.addEventListener('click', () => { /* exit game logic */ });
muteButton.addEventListener('click', () => { soundsEnabled = !soundsEnabled; });

// Card click handler
function onCardClick(event) {
    const cardId = event.target.dataset.id;
    const card = cards[cardId];
    revealCard(card);
}

// Start the game initially
document.addEventListener('DOMContentLoaded', startGame);
