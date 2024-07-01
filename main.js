const images = [
    './images/albus.png', './images/harry.png', './images/dobby.png', 
    './images/hermione.png', './images/ron.png', './images/lord.png', 
    './images/minerva.png', './images/draco.png'
];
let cards = shuffle(images.concat(images));
let selectedCards = [];
let score = 0;
let timeLeft = 30;
let gameInterval;

const startbtn = document.getElementById('startbtn');
const restartbtn = document.getElementById('restartbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

function generateCards() {
    for (const imgSrc of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgSrc;

        const img = document.createElement('img');
        img.src = imgSrc;
        img.classList.add('hidden');
        
        card.appendChild(img);
        gameContainer.appendChild(card);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleCardClick(event) {
    const card = event.target.closest('.card');
    if (!card || card.classList.contains('matched') || selectedCards.includes(card)) {
        return;
    }
    const img = card.querySelector('img');
    img.classList.remove('hidden');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;
    const img1 = card1.querySelector('img');
    const img2 = card2.querySelector('img');

    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2;
        scoreElement.innerHTML = `Score:<br/> ${score}`;

        // check if all cards are matched
        if (document.querySelectorAll('.card.matched').length === cards.length) {
            clearInterval(gameInterval);
            alert('Congratulations! You matched all the cards!');
            startbtn.disabled = false;
            restartbtn.disabled = true;
        }
    } else {
        img1.classList.add('hidden');
        img2.classList.add('hidden');
    }
    selectedCards = [];
}

function startGame() {
    resetGame(); // reset the game state without starting the timer
    startGameTimer(); // start the timer
    startbtn.disabled = true;
    restartbtn.disabled = false;
}

function startGameTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(gameInterval);
            alert('Game Over! Try again!');
            startbtn.disabled = false;
            restartbtn.disabled = true;
        }
    }, 1000);
}

function resetGame() {
    clearInterval(gameInterval); // clear any existing intervals
    timeLeft = 30; // reset timeLeft
    score = 0; // reset score to zero
    scoreElement.innerHTML = `Score:<br/> ${score}`;
    timerElement.textContent = timeLeft;
    cards = shuffle(images.concat(images)); // shuffle cards
    selectedCards = [];
    gameContainer.innerHTML = ''; // clear previous cards
    generateCards(); // generate new set of cards
    gameContainer.addEventListener('click', handleCardClick);
    startbtn.disabled = false; // enable start button
}

startbtn.addEventListener('click', startGame);
restartbtn.addEventListener('click', resetGame);