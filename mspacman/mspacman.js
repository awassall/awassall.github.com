function draw(ctx,img,a,b,c,d,e,f)
{
	ctx.drawImage(img, a, b, c, d, e, f, c, d);
}

function gameBoard()
{
	var c = document.getElementById("board");
	if (c.getContext) {
		var context = c.getContext("2d");
		var board = new Image();
		var mspacman = new Image();
		var ghost1 = new Image();
		board.onload = draw(context, board, 322, 2, 464, 136, 0, 0, 464, 136);
		board.src = 'pacman10-hp-sprite.png';
		mspacman.onload = draw(context, mspacman, 322, 2, 464, 136, 0, 0, 464, 136);
		mspacman.src = 'pacman10-hp-sprite.png';
		ghost1.onload = draw(context, ghost1, 322, 2, 464, 136, 0, 0, 464, 136);
		ghost1.src = 'pacman10-hp-sprite.png';	
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}