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
	clearHangman();
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
		body(game['incorrect'].length);
		game['incorrect'].push(guessValue);
		guesses.innerHTML = guesses.innerHTML + '<span>' + guessValue + '</span>';

		// max guesses
		if(game['incorrect'].length >= 9) {
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

var styles = {
	'width': 5,
	'color': '#37352F'
}

function clearHangman() {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(240.5, 75.5, 70, 200);
}

function body(part) {
	var ctx = canvas.getContext('2d');
	ctx.beginPath();

	var strength = styles['width'];

	if(part === 0) {
		// head
		ctx.moveTo(300.5, 103);
		ctx.arc(275.5, 103, 25.5, 0, Math.PI * 2, true);
	} else if(part === 1) {
		// torso
		ctx.moveTo(275.5, 128.5);
		ctx.lineTo(275.5, 228.5);
	} else if(part === 2) {
		// left leg
		ctx.moveTo(276.5, 226.5);
		ctx.lineTo(251.5, 251.5);
	} else if(part === 3) {
		// right leg
		ctx.moveTo(274.5, 226.5);
		ctx.lineTo(299.5, 251.5);
	} else if(part === 4) {
		// left arm
		ctx.moveTo(275.5, 150.5);
		ctx.lineTo(240.5, 160.5);
	} else if(part === 5) {
		// right arm
		ctx.moveTo(275.5, 150.5);
		ctx.lineTo(310.5, 160.5);
	} else if(part === 6) {
		// left eye
		ctx.arc(267.5, 96.5, 2, 0, Math.PI * 2, true);
		strength = 3;
	} else if(part === 7) {
		ctx.arc(283.5, 96.5, 2, 0, Math.PI * 2, true);
		strength = 3;
	} else if(part === 8) {
		ctx.arc(275.5, 109.5, 10, 0, Math.PI, false);
		strength = 3;
	}

	ctx.lineWidth = strength;
	ctx.strokeStyle = styles['color'];
	ctx.stroke();
}

if(canvas.getContext) {
	var ctx = canvas.getContext('2d');

	ctx.beginPath();
	ctx.moveTo(345.5, 345.5);
	ctx.lineTo(0, 345.5);
	ctx.lineTo(50.5, 295.5)
	ctx.lineTo(100.5, 345.5);
	ctx.moveTo(50.5, 345.5);
	ctx.lineTo(50.5, 5.5);
	ctx.lineTo(275.5, 5.5);
	ctx.lineTo(275.5, 75.5);
	ctx.moveTo(50.5, 55.5);
	ctx.lineTo(100.5, 5.5);
	ctx.lineWidth = styles['width'];
	ctx.strokeStyle = styles['color'];
	ctx.stroke();
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