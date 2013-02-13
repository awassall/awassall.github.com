function gameBoard()
{
	var c = document.getElementById("board");
	if (c.getContext) {
		var context = c.getContext("2d");
		var board = new Image();
		var mspacman = new Image();
		var ghost1 = new Image();
		board.onload = function() {
			context.drawImage(board, 322, 2, 464, 136, 0, 0, 464, 136);
		}
		mspacman.onload = function() {
			context.drawImage(mspacman, 322, 2, 464, 136, 0, 0, 464, 136);
		}
		ghost1.onload = function() {
			context.drawImage(ghost1, 322, 2, 464, 136, 0, 0, 464, 136);
		}
		board.src = 'pacman10-hp-sprite.png';
		mspacman.src = 'pacman10-hp-sprite.png';
		ghost1.src = 'pacman10-hp-sprite.png';	
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}