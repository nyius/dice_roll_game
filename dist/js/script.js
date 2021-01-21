'use strict';
///////////////////////////////    Selecting Elements     ///////////////////////////////
let score0_el = document.querySelector('#score-0');
let score1_el = document.querySelector('#score-1');
let dice_el = document.querySelector('.dice');
const btnNew = document.querySelector('.btn-new');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');
const overlay = document.querySelector('.overlay');
const youWin = document.querySelector('.winner-name');
const closeOverlay = document.querySelector('.close-modal');
let current0_el = document.querySelector('#current-0');
let current1_el = document.querySelector('#current-1');
let player0_el = document.querySelector('.player-0');
let player1_el = document.querySelector('.player-1');

///////////////////////////////    Variables     ///////////////////////////////
let currentScore = 0;
let activePlayer = 0;
let scores = [0, 0];
let dice = 0;
let playing = true;

/////////////////////////////////////    Functions     /////////////////////////////////////
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const swapPlayer = function () {
	document.querySelector(`#current-${activePlayer}`).textContent = currentScore;
	activePlayer = activePlayer === 0 ? 1 : 0;

	// swap the active player element
	player0_el.classList.toggle('player-active');
	player1_el.classList.toggle('player-active');
};

const addHidden = function (className) {
	className.classList.add('hidden');
};

const closeWin = function () {
	overlay.classList.add('hidden');
};

// initialize all values to default
const init = function () {
	currentScore = 0;
	activePlayer = 0;
	scores = [0, 0];
	dice = 0;
	playing = true;

	score0_el.textContent = 0;
	score1_el.textContent = 0;
	current0_el.textContent = 0;
	current1_el.textContent = 0;

	addHidden(dice_el);
	addHidden(overlay);
	document.querySelector(`.player-1`).classList.remove('player-winner');
	document.querySelector(`.player-0`).classList.remove('player-winner');
	player0_el.classList.add('player-active');
	player1_el.classList.remove('player-active');
};

init();

///////////////////////////////    Rolling Dice Function     ///////////////////////////////
btnRoll.addEventListener('click', async function () {
	if (playing) {
		// 1. display the dice
		dice_el.classList.remove('hidden');

		// Animate the dice rolling
		for (let i = 0; i < 10; i++) {
			dice = Math.trunc(Math.random() * 6) + 1;
			await sleep(50);
			dice_el.src = `/dist/img/dice-${dice}.png`;
		}

		// display the final dice to add to the score
		dice = Math.trunc(Math.random() * 6) + 1;
		dice_el.src = `/dist/img/dice-${dice}.png`;

		// 3. check for roll = 1.
		if (dice !== 1) {
			//add dice to current score
			currentScore += dice;
			document.querySelector(
				`#current-${activePlayer}`
			).textContent = currentScore;
		} else {
			// if true switch player. player loses all score
			// if active player is 0, then switch to 1. else switch to 0
			currentScore = 0;
			swapPlayer();
		}
	}
});

///////////////////////////////    Hold Button     ///////////////////////////////
btnHold.addEventListener('click', function () {
	if (playing) {
		// 1. add current score to active player score
		scores[activePlayer] += currentScore;

		document.querySelector(`#score-${activePlayer}`).textContent =
			scores[activePlayer];
		currentScore = 0;
		// 2. check if players score is >= 100
		if (scores[activePlayer] >= 10) {
			// finish game
			document
				.querySelector(`.player-${activePlayer}`)
				.classList.add('player-winner');
			document
				.querySelector(`.player-${activePlayer}`)
				.classList.remove('player-active');
			addHidden(dice_el);
			currentScore = 0;
			playing = false;

			// show the you win overlay
			overlay.classList.remove('hidden');
			youWin.textContent = `Player ${activePlayer + 1} wins!`;
		} else {
			// switch to next player
			swapPlayer();
		}
	}
});

///////////////////////////////    New Game Button     ///////////////////////////////
btnNew.addEventListener('click', function () {
	init();
});

///////////////////////////////    Overlay Click Off   ///////////////////////////////
overlay.addEventListener('click', closeWin);
closeOverlay.addEventListener('click', closeWin);

///////////////////////////////    overlay ESC press     ///////////////////////////////
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
		closeWin();
	}
});
