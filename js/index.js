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
		finalWord.innerHTML = finalWord.innerHTML + '<span class="' + className + '">' + word[i] + '</span>';
	}
}

var input 	= document.getElementById('word'),
	img	  	= document.getElementById('hide'),
	submit  = document.getElementById('play');

img.addEventListener('mouseup', function() { showHide(input, img) }, false);
submit.addEventListener('mouseup', function() { play(input) }, false);

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