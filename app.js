(function () {

	let betAmount = 0;
	let account = new Account();
	let firstClick = true;
	let deck = [];
	let hand = null;

	let doh = document.getElementById('doh');

	let hands = [
		'Jacks or Better',
		'2 Pair',
		'3 Of A Kind',
		'Straight',
		'Flush',
		'Full House',
		'4 Of A Kind',
		'Straight Flush',
		'Royal Flush'
	];
	let multiplier = [
		[1, 2, 3, 4, 5, 7, 20, 30, 80],
		[2, 4, 6, 8, 10, 14, 40, 60, 160],
		[4, 8, 12, 16, 20, 28, 80, 120, 320]
	];

	let balance = document.getElementById('balance');
	let bet = document.getElementById('bet');
	let deal = document.getElementById('btnDeal');
	let banner = document.getElementById('banner');
	let playAgain = document.getElementById('btnPlayAgain');

	let card0 = document.getElementById('card0');
	let card1 = document.getElementById('card1');
	let card2 = document.getElementById('card2');
	let card3 = document.getElementById('card3');
	let card4 = document.getElementById('card4');

	let playerHand = document.getElementById('playerHand');
	let cardReset = '<div class="col-md-6 col-md-offset-3 text-center"><a id="saveCard0" href="#"><img id="card0" class="card" src="img/back.png" alt=" "></a><a id="saveCard1" href="#"><img id="card1" class="card" src="img/back.png" alt=" "></a><a id="saveCard2" href="#"><img id="card2" class="card" src="img/back.png" alt=" "></a><a id="saveCard3" href="#"><img id="card3" class="card" src="img/back.png" alt=" "></a><a id="saveCard4" href="#"><img id="card4" class="card" src="img/back.png" alt=" "></a></div>';

	let cardImages = [];
	cardImages[0] = document.getElementById('card0');
	cardImages[1] = document.getElementById('card1');
	cardImages[2] = document.getElementById('card2');
	cardImages[3] = document.getElementById('card3');
	cardImages[4] = document.getElementById('card4');


	let saveLinks = [];
	saveLinks[0] = document.getElementById('saveCard0');
	saveLinks[1] = document.getElementById('saveCard1');
	saveLinks[2] = document.getElementById('saveCard2');
	saveLinks[3] = document.getElementById('saveCard3');
	saveLinks[4] = document.getElementById('saveCard4');

	deal.classList.add('disabled');
	deal.addEventListener('click', dealCards);
	bet.addEventListener('change', handleBetChange);
	playAgain.addEventListener('click', dealAgain);

	saveLinks.forEach(function (link) {
		link.addEventListener('click', keepCard);
	});
	
	if(account.balance < 1){
		account.load(24);
	}

	updateBalance(0);
	function handleBetChange(event) {
		betAmount = event.target.valueAsNumber;

		if (betAmount > 0 && betAmount <= account.balance) {
			deal.classList.remove('disabled');
		}
		else {
			deal.classList.add('disabled');
		}

	}

	function dealAgain() {
		//get rid of win/lose banner text
		showResult('');

		//hids deal again button
		playAgain.classList.add('hidden');

		//resets player's hand shows back of cards'
		cardImages.forEach(function (img) {
			img.src = 'img/back.png';
		});

		bet.value = 0;
		firstClick = true;

	}

	function dealCards() {
		if (deal.classList.contains('disabled')) {
			return;
		}
		if (firstClick) {
			firstClick = false;
			updateBalance(-betAmount);

			deck = getDeck();
			hand = new PokerHand();

			for (var i = 0; i < 5; i++) {
				let card = deck.shift();
				dealCard(card, i);
			}
			console.log("1st deal", hand);
		}
		else {
			for (var i = 0; i < 5; i++) {
				if (!cardImages[i].classList.contains('hold')) {
					let card = deck.shift();
					dealCard(card, i);
				}
				else {
					cardImages[i].classList.remove('hold');

				}
			}
			console.log("2nd deal", hand);
			deal.classList.add('disabled');

			let handValue = hand.evaluate();

			if (handValue > -1) {
				let tier = 0;

				if (betAmount >= 13) {
					tier = 2;
				}
				else if (betAmount >= 6) {
					tier = 1;
				}
				let winnings = multiplier[tier][handValue] * betAmount;

				showResult(hands[handValue] + '<br>You win ' + winnings + ' donuts! <img height="125" src="img/donut.png">');
				updateBalance(winnings);

			}
			else {
				showResult('Try Again');
				doh.play();
			}

			playAgain.classList.remove('hidden');
		}

	}

	function keepCard(event) {
		let image = event.target;
		if (image.classList.contains('hold')) {
			image.classList.remove('hold');
		}
		else {
			image.classList.add('hold');
		}

	}

	function showResult(message) {
		banner.innerHTML = message;
	}

	function dealCard(card, position) {
		hand.deal(card, position);
		cardImages[position].src = 'img/' + card + '.png';
	}

	function updateBalance(amount) {
		account.update(amount);
		balance.innerHTML = "<strong>" + account.balance + "</strong>";
	}

	function getDeck() {

		let deck = [
			'2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
			'2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
			'2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
			'2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD'
		];

		return shuffle(deck);
	}

	function shuffle(array) {

		// Fisher–Yates Shuffle		
		// Source: https://bost.ocks.org/mike/shuffle/

		let m = array.length, t, i;

		// While there remain elements to shuffle…
		while (m) {

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}

})();