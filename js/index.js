function showHide(input, img) {
	var text = input.value,
		source = img.src.split('/');

	source = source[source.length - 1];

	if(source === "hideWord.png") {
		input.type = "text";
		img.src = "img/showWord.png";
		cursorEnd(input);
	} else {
		input.type = "password";
		img.src = "img/hideWord.png";
		cursorEnd(input);
	}
}

function play(input) {
	var word 	  = input.value,
		finalWord = document.getElementById('final-word'),
		guesses	  = document.getElementById('guesses'),
		result 	  = document.getElementById('result');

	finalWord.innerHTML = "";

	for(var i = 0, len = word.length; i < len; i++) {
		var className = (word[i] === " ") ? "space" : "letter";
		finalWord.innerHTML = finalWord.innerHTML + '<div class="' + className + '"><span class="single-letter">' + word[i] + '</span></div>';
	}

	game['correct'] = [];
	game['incorrect'] = [];
	guesses.innerHTML = "";
	result.style.display = 'none';
	cursorEnd(document.getElementById('guess'));
	playWord = word;
}

function guess(guessInput) {
	if(playWord === null) return;
	var guessValue = guessInput.value.toLowerCase(),
		guesses = document.getElementById('guesses');

	var letters 	 = document.getElementsByClassName('single-letter'),
		guessCorrect = false;

	guessCorrect = showResult(guessValue, letters, guessCorrect, " letter-show", false);

	if(game['correct'].length === playWord.length) {
		gameOver(1);
	}

	if(guessCorrect === false && game['incorrect'].indexOf(guessValue) === -1) {
		game['incorrect'].push(guessValue);
		guesses.innerHTML = guesses.innerHTML + '<span>' + guessValue + '</span>';

		// max guesses
		if(game['incorrect'].length >= 10) {
			gameOver(0);
		}
	}

	guessInput.value = "";
}

function showResult(guessValue, letters, guessCorrect, classAdd, over) {
	for(var i = 0, len = letters.length; i < len; i++) {
		if(guessValue === letters[i].innerHTML || guessValue === playWord || over) {
			guessCorrect = true;
			if(over || letters[i].className.split(' ').length === 1) {
				game['correct'].push(letters[i].innerHTML);
				letters[i].className = letters[i].className + classAdd;
			}
		}
	}

	return guessCorrect;
}

function gameOver(outcome) {
	var result = document.getElementById('result');

	if(outcome === 0) {
		result.className = "loser";
		result.innerHTML = "You lose :(";

		showResult(null, document.getElementsByClassName('single-letter'), false, " loser", true);

	} else {
		result.className = "";
		result.innerHTML = "Winner!";
	}

	playWord = null;
	result.style.display = "block";
	input.value = "";
	input.focus();
}

var input 	= document.getElementById('word'),
	img	  	= document.getElementById('hide'),
	submit  = document.getElementById('play'),
	canvas  = document.getElementById('draw'),
	guessI  = document.getElementById('guess'),
	guessS  = document.getElementById('guess-submit');

var playWord = null;
var game = {
	'correct': [],
	'incorrect': []
}

img.addEventListener('mouseup', function() { showHide(input, img) }, false);
submit.addEventListener('mouseup', function() { play(input) }, false);

guessS.addEventListener('mouseup', function() { guess(guessI) }, false);

var ctrlPressed = false;
input.onkeydown = function(e) {
	var code = e.keyCode || e.which;

	if(code === 17 && !ctrlPressed) {
		ctrlPressed = true;
		showHide(input, img);
	}

	if(code === 13) {
		play(input);
	}
};

input.onkeyup = function(e) {
	var code = e.keyCode || e.which;
	if(code === 17 && ctrlPressed) {
		ctrlPressed = false;
		showHide(input, img);
	}
};

guessI.onkeydown = function(e) {
	var code = e.keyCode || e.which;

	if(code === 13) {
		guess(guessI);
	}
};

submit.onkeydown = function(e) {
	var code = e.keyCode || e.which;

	if(code === 32) {
		play(input);
		return false;
	}
};

guessS.onkeydown = function(e) {
	var code = e.keyCode || e.which;

	if(code === 32) {
		guess(guessI);
	}
};

/*
var focused = true;
window.addEventListener('focus', function() {
	focused = true;
});

window.addEventListener('blur', function() {
	focused = false;
});
*/

if(canvas.getContext) {
	var ctx = canvas.getContext('2d');

	ctx.beginPath();
	ctx.moveTo(395.5, 395.5);
	ctx.lineTo(0, 395.5);
	ctx.lineTo(50.5, 345.5)
	ctx.lineTo(100.5, 395.5);
	ctx.moveTo(50.5, 395.5);
	ctx.lineTo(50.5, 5.5);
	ctx.lineTo(275.5, 5.5);
	ctx.lineTo(275.5, 75.5);
	ctx.moveTo(50.5, 55.5);
	ctx.lineTo(100.5, 5.5);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#37352F";
	ctx.stroke();

	/*
	var requestAnimationFrame =
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function(callback) {
				return setTimeout(callback, 1);
			};

	var square = {
		'x': 0,
		'y': 395,
		'width': 5,
		'height': 5,
		'fill': '#37352F'
	};

	var render = function() {
		// clear the canvas
		// ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw the square
		ctx.beginPath();
		ctx.rect(square.x, square.y, square.width, square.height);
		ctx.fillStyle = square.fill;
		ctx.fill();

		// redraw
		requestAnimationFrame(render);
	};

	// start the redrawing process
	render();

	var animate = function(prop, val, duration) {
		var start	 = new Date().getTime(),
			end 	 = start + duration,
			current  = square[prop],
			distance = val - current;

		var step = function() {
			// get current progress
			var timestamp = new Date().getTime(),
				progress  = Math.min((duration - (end - timestamp)) / duration, 1);

			// update the square's property
			square[prop] = current + (distance * progress);

			// if the animation hasn't finished, repeat the step
			if(progress < 1) requestAnimationFrame(step);
		};

		// start the animation
		return step();
	};

	animate('y', 0, 5000);
	setTimeout(function() {
		animate('x', 195, 2500);
	}, 5000);
	setTimeout(function() {
		animate('y', 75, 1000);
	}, 7500);
	*/
}

// http://stackoverflow.com/a/4331028/986991
function cursorEnd(input) {
	if(input.setSelectionRange) {
		var len = input.value.length * 2;
		input.setSelectionRange(len, len);
	} else {
		input.value = input.value;
	}

	input.scrollLeft = 999999;
}