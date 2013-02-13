function gameBoard()
{
	var c = document.getElementById("board");
	if (c.getContext) {
		var context = c.getContext("2d");
		var sprite = new Image();
		sprite.onload = function() {
			context.drawImage(sprite, 322, 2, 464, 136, 0, 0, 464, 136);
			context.drawImage(sprite, 84, 3, 13, 14, 175, 29, 13, 14);
			context.drawImage(sprite, 3, 123, 14, 14, 181, 70, 14, 14);
		}
		sprite.src = 'pacman10-hp-sprite.png';	
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}