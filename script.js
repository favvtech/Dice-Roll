'use strict';

// ELEMENT SELECTORS
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const diceEl = document.querySelector('.dice');
const name0El = document.getElementById('name--0');
const name1El = document.getElementById('name--1');

// CREATE CELEBRATION ELEMENTS
const celebrationEl = document.createElement('div');
celebrationEl.id = 'celebration-overlay';
celebrationEl.style.position = 'fixed';
celebrationEl.style.top = 0;
celebrationEl.style.left = 0;
celebrationEl.style.width = '100vw';
celebrationEl.style.height = '100vh';
celebrationEl.style.background = 'rgba(0,0,0,0.4)';
celebrationEl.style.display = 'none';
celebrationEl.style.justifyContent = 'center';
celebrationEl.style.alignItems = 'center';
celebrationEl.style.zIndex = 9999;

const celebrationBox = document.createElement('div');
celebrationBox.style.background = 'rgba(255,255,255,0.9)';
celebrationBox.style.borderRadius = '1rem';
celebrationBox.style.padding = '3rem';
celebrationBox.style.textAlign = 'center';
celebrationBox.style.position = 'relative';
celebrationBox.style.animation = 'popIn 0.6s ease';
celebrationBox.innerHTML = `
  <span id="close-celebration" style="
    position:absolute;
    top:1rem;
    right:1rem;
    font-size:2rem;
    cursor:pointer;
    font-weight:bold;
    color:#333;
  ">&times;</span>
  <h1 id="winner-text" style="
    font-size:3rem;
    color:#c7365f;
    margin-bottom:2rem;
  "></h1>
  <p style="font-size:1.6rem;color:#333;">Click anywhere to close 🎉</p>
`;

// Add confetti burst effect using basic CSS shapes (optional enhancement)
celebrationBox.insertAdjacentHTML('afterbegin', `<div style="
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 2rem solid transparent;
  border-right: 2rem solid transparent;
  border-bottom: 2rem solid gold;
"></div>`);

celebrationEl.appendChild(celebrationBox);
document.body.appendChild(celebrationEl);

// PLAYER NAME PROMPTS
const playerNames = [
  prompt("Enter name:", 'Player 1') || 'Player 1',
  prompt("Enter name:", 'Player 2') || 'Player 2',
];
name0El.textContent = playerNames[0];
name1El.textContent = playerNames[1];

const score = [0, 0];
let currentScore = 0;
let activePlayer = 0;

// RESET FUNCTION
const reset = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  diceEl.classList.add('hidden');
  currentScore = 0;
  score[0] = 0;
  score[1] = 0;

  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');

  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  btnRoll.disabled = false;
  btnHold.disabled = false;

  name0El.textContent = playerNames[0];
  name1El.textContent = playerNames[1];
  celebrationEl.style.display = 'none';
};
reset();

const playing = function (player) {
  return player.classList.contains('player--active');
};

const roll = function (player1, currtScore, player2) {
  const currentPlayer = playing(player1);
  const randomDice = Math.trunc(Math.random() * 6 + 1);
  diceEl.src = `dice-${randomDice}.png`;
  diceEl.classList.remove('hidden');

  if (currentPlayer) {
    if (randomDice === 1) {
      currentScore = 0;
      currtScore.textContent = currentScore;
      player1.classList.remove('player--active');
      player2.classList.add('player--active');
      diceEl.classList.add('hidden');
    } else {
      currentScore += randomDice;
      currtScore.textContent = currentScore;
    }
  }
};

btnRoll.addEventListener('click', function () {
  if (playing(player0El)) {
    roll(player0El, current0El, player1El);
  } else {
    roll(player1El, current1El, player0El);
  }
});

const hold = function (active, scoreEl, currtScoreEl, player, otherPlayer) {
  score[active] += currentScore;
  scoreEl.textContent = score[active];

  if (score[active] >= 100) {
    player.classList.add('player--winner');
    btnRoll.disabled = true;
    btnHold.disabled = true;

    // WINNER CELEBRATION
    const winnerName = playerNames[active];
    document.getElementById('winner-text').textContent = `${winnerName} Wins! 🎉`;
    celebrationEl.style.display = 'flex';
  } else {
    currentScore = 0;
    currtScoreEl.textContent = currentScore;
    player.classList.remove('player--active');
    otherPlayer.classList.add('player--active');
    diceEl.classList.add('hidden');
  }
};

btnHold.addEventListener('click', function () {
  if (playing(player0El)) {
    activePlayer = 0;
    hold(activePlayer, score0El, current0El, player0El, player1El);
  } else {
    activePlayer = 1;
    hold(activePlayer, score1El, current1El, player1El, player0El);
  }
});

btnNew.addEventListener('click', reset);

// CELEBRATION DISMISS HANDLERS
document.getElementById('close-celebration').addEventListener('click', function () {
  celebrationEl.style.display = 'none';
});
celebrationEl.addEventListener('click', function (e) {
  if (e.target === celebrationEl) {
    celebrationEl.style.display = 'none';
  }
});