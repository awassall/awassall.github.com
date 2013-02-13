function gameBoard()
{
	var c = document.getElementById("board");
	if (c.getContext) {
		var context = c.getContext("2d");
		var board = new Image();
		board.src = 'pacman10-hp-sprite.png';
		board.onload = function () {
			context.drawImage(board, 322, 2, 464, 136, 0, 0, 464, 136);
		}
		var mspacman = new Image();
		mspacman.src = 'pacman10-hp-sprite.png';
		context.drawImage(mspacman, 84, 3, 13, 14, 175, 29, 13, 14);
		var ghost1 = new Image();
		ghost1.src = 'pacman10-hp-sprite.png';
		context.drawImage(ghost1, 3, 123, 14, 14, 181, 70, 14, 14);
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}