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
		finalWord = document.getElementById('final-word');

	finalWord.innerHTML = "";

	for(var i = 0, len = word.length; i < len; i++) {
		var className = (word[i] === " ") ? "space" : "letter";
		finalWord.innerHTML = finalWord.innerHTML + '<div class="' + className + '"><span class="single-letter">' + word[i] + '</span></div>';
	}

	cursorEnd(document.getElementById('guess'));
	playWord = word;
}

function guess(guessInput) {
	var guessValue = guessInput.value,
		guesses = document.getElementById('guesses');

	var letters 	 = document.getElementsByClassName('single-letter'),
		guessCorrect = false;
	for(var i = 0, len = letters.length; i < len; i++) {
		if(guessValue === letters[i].innerHTML || guessValue === playWord) {
			guessCorrect = true;
			if(letters[i].className.split(' ').length === 1) {
				game['correct'].push(letters[i].innerHTML);
				letters[i].className = letters[i].className + " letter-show";
			}
		}
	}

	if(guessCorrect === false) {
		guesses.innerHTML = guesses.innerHTML + '<span>' + guessValue + '</span>';
	}

	guessInput.value = "";
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

if(canvas.getContext) {
	var context = canvas.getContext('2d');

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
		// context.clearRect(0, 0, canvas.width, canvas.height);

		// draw the square
		context.beginPath();
		context.rect(square.x, square.y, square.width, square.height);
		context.fillStyle = square.fill;
		context.fill();

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
		animate('y', 100, 1000);
	}, 7500);
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