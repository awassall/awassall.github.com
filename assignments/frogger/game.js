function start_game() {
	var params = new Array(); //score, highscore, level, lives, newgame, frogx, frogy, time (ms)
	params[4] = true; //newgame is true
	setParams(params);
	var c = document.getElementById("game");
	if (c.getContext) {
		var context = c.getContext("2d");
		var sprite = new Image();
		sprite.onload = function () {
			drawGameboard(sprite,context);
			drawObstacles(sprite,params,context);
			drawFrog(sprite,params,context);
			drawLives(sprite,params,context);
			drawScoreboard(sprite,params,context);
			params[4] = false; //game is now ongoing
		}
		sprite.src = 'assets/frogger_sprites.png';
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}

function setParams(params,d) {
	if (params[4] == true) {
		params[0] = 0; //score
		params[1] = 0; //highscore
		params[2] = 1; //level
		params[3] = 2; //lives
		//don't set newgame to false just yet
		params[5] = 188; //frog start x-coordinate
		params[6] = 498; //frog start y-coordinate
		params[7] = 0; //start time is 0
	}
	else {
		//will be coded for live game
	}
}

function drawLives(sprite,params,context) {
	for (var i=0; i<(params[3]); i++) {
		context.drawImage(sprite,13,334,17,23,20*i,527,17,23);
	}
}

function drawScoreboard(sprite,params,context) {
	context.fillStyle = "rgb(0,255,0)";
	context.font = "bold 18pt arial";
	context.fillText("Level " + params[2],65,547);
	context.font = "bold 11pt arial";
	context.fillText("Score: " + params[0],0,562);
	context.fillText("Highscore: " + params[1],100,562);
}

function drawFrog(sprite,params,context) {
	context.drawImage(sprite,12,369,23,17,params[5],params[6],23,17);
}

function drawObstacles(sprite,params,context) {
	if (params[4] == true) {
		context.drawImage(sprite,7,165,178,22,40,200,178,22); //big log randomly in water
		context.drawImage(sprite,10,267,28,20,120,400,28,20); //pink car randomly on road
		context.drawImage(sprite,82,264,24,26,300,397,24,26); //yellow car randomly on road
	}
	else {
		//will be coded for live game
	}
}

function drawGameboard(sprite,context) {
	context.fillStyle = "#191970";
	context.fillRect(0, 0, 399, 565); //fills water
	context.fillStyle = "#000000";
	context.fillRect(0, 300, 399, 265); //fills road
	context.drawImage(sprite,0,120,399,32,0,283,399,32); //purple things
	context.drawImage(sprite,0,120,399,32,0,495,399,32); //purple things
	context.drawImage(sprite,0,55,399,53,0,56,399,53); //green thing
	context.drawImage(sprite,15,13,318,31,15,13,318,31); //frogger logo
}