var params = new Array(); //score, highscore, level, lives, newgame, frogx, frogy, time (ms), # of wins
var cars = new Array(); //car x,y coordinates
var logs = new Array(); //water obstacles x,y coordinates
var context;
var sprite;

function start_game() {
	params[4] = true; //newgame is true
	setParams(params, cars, logs);
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
		document.addEventListener("keydown", function(event) {
			if ((event.keyCode == 37) && (params[5] > 8)) {
				params[5] = params[5] - 30;
			}
			if ((event.keyCode == 38) && (params[6] > 78)) {
				params[6] = params[6] - 35;
			}
			if ((event.keyCode == 39) && (params[5] < 368)) {
				params[5] = params[5] + 30;
			}
			if ((event.keyCode == 40) && (params[6] < 498)) {
				params[6] = params[6] + 35;
			}
			checkLoss(event.keyCode,params,cars,logs);
		});
		setInterval(function() {
			console.log("redrawn");
			drawGameboard(sprite,context);
			drawObstacles(sprite,params,context);
			drawFrog(sprite,params,context);
			drawLives(sprite,params,context);
			drawScoreboard(sprite,params,context);
			moveObstacles(params,cars,logs);
			checkLoss(0,params,cars,logs);
		},50);
	}
	else {
		alert("Sorry, canvas is not supported on your browser!");
	}
}

function moveObstacles(params,cars,logs) {
	for (var j=1;j<15;j+=3) {
		for (var h=0;h<3;h++) {
			if ((params[6] == logs[j+h][1]) && (params[5] + 23 >= logs[j+h][0])) {
				if ((h == 0) && (params[5] <= logs[j+h][0] + 177)) {
					if (((j+2)/3 == 1) && (params[5] + 23 < 397)) {
						params[5] += 3;
					}
					if (((j+2)/3 == 2) && (params[5] > 4)) {
						params[5] -= 5;
					}
					if (((j+2)/3 == 3) && (params[5] + 23 < 393)) {
						params[5] += 7;
					}
					if (((j+2)/3 == 4) && (params[5] > 5)) {
						params[5] -= 6;
					}
					if (((j+2)/3 == 5) && (params[5] + 23 < 395)) {
						params[5] += 5;
					}
				}
				if ((h == 1) && (params[5] <= logs[j+h][0] + 116)) {
					if (((j+2)/3 == 1) && (params[5] + 23 < 397)) {
						params[5] += 3;
					}
					if (((j+2)/3 == 2) && (params[5] > 4)) {
						params[5] -= 5;
					}
					if (((j+2)/3 == 3) && (params[5] + 23 < 393)) {
						params[5] += 7;
					}
					if (((j+2)/3 == 4) && (params[5] > 5)) {
						params[5] -= 6;
					}
					if (((j+2)/3 == 5) && (params[5] + 23 < 395)) {
						params[5] += 5;
					}
				}
				if ((h == 2) && (params[5] <= logs[j+h][0] + 84)) {
					if (((j+2)/3 == 1) && (params[5] + 23 < 397)) {
						params[5] += 3;
					}
					if (((j+2)/3 == 2) && (params[5] > 4)) {
						params[5] -= 5;
					}
					if (((j+2)/3 == 3) && (params[5] + 23 < 393)) {
						params[5] += 7;
					}
					if (((j+2)/3 == 4) && (params[5] > 5)) {
						params[5] -= 6;
					}
					if (((j+2)/3 == 5) && (params[5] + 23 < 395)) {
						params[5] += 5;
					}					
				}
			}
		}
	}

	for (var j=1;j<15;j+=3) {
		for (var h=0;h<3;h++) {
			if ((j+2)/3 == 1) {
				cars[j+h][0] -= 4;
				logs[j+h][0] += 3;
				if (cars[j+h][0] < -45) { cars[j+h][0] = 399; }
				if (logs[j+h][0] > 500) { logs[j+h][0] = -180; }
			}
			if ((j+2)/3 == 2) {
				cars[j+h][0] += 4;
				logs[j+h][0] -=5;
				if (cars[j+h][0] > 400) { cars[j+h][0] = -45; }
				if (logs[j+h][0] < -180) { logs[j+h][0] = 600; }
			}
			if ((j+2)/3 == 3) {
				cars[j+h][0] -= 5;
				logs[j+h][0] += 7;
				if (cars[j+h][0] < -45) { cars[j+h][0] = 399; }
				if (logs[j+h][0] > 500) { logs[j+h][0] = -180; }
			}
			if ((j+2)/3 == 4) {
				cars[j+h][0] += 5;
				logs[j+h][0] -= 6;
				if (cars[j+h][0] > 400) { cars[j+h][0] = -45; }
				if (logs[j+h][0] < -180) { logs[j+h][0] = 600; }
			}
			if ((j+2)/3 == 5) {
				cars[j+h][0] -= 3;
				logs[j+h][0] += 5;
				if (cars[j+h][0] < -45) { cars[j+h][0] = 399; }
				if (logs[j+h][0] > 500) { logs[j+h][0] = -180; }
			}
		}
	}
}

function frogDeath(params,cars,logs) {
	params[3] -= 1;
	params[5] = 188;
	params[6] = 498;
	if (params[3] < 0) {
		setParams(params,cars,logs);
		alert("You lost! Click OK to play again.");
	}
}

function checkLoss(key, params, cars, logs) {
	var carloss = 0;
	//checks cars
	if (params[6] > 288) {
		for (var j=1;j<15;j+=3) {
			for (var h=0;h<3;h++) {
				if ((params[6] == cars[j+h][1]) && (params[5] + 23 >= cars[j+h][0])) {
					if (((j+2)/3 == 1) && (params[5] <= cars[j+h][0] + 28)) {
						frogDeath(params,cars,logs);
						carloss = 1;
					}
					if (((j+2)/3 == 2) && (params[5] <= cars[j+h][0] + 24)) {
						frogDeath(params,cars,logs);
						carloss = 1;
					}
					if (((j+2)/3 == 3) && (params[5] <= cars[j+h][0] + 24)) {
						frogDeath(params,cars,logs);
						carloss = 1;
					}
					if (((j+2)/3 == 4) && (params[5] <= cars[j+h][0] + 44)) {
						frogDeath(params,cars,logs);
						carloss = 1;
					}
					if (((j+2)/3 == 5) && (params[5] <= cars[j+h][0] + 23)) {
						frogDeath(params,cars,logs);
						carloss = 1;
					}
				}
			}
		}
	}

	var waterloss = 0;
	//checks water
	if ((params[6] < 288) && (params[6] > 78)) {
		waterloss = 1;
		for (var j=1;j<15;j+=3) {
			for (var h=0;h<3;h++) {
				if ((params[6] == logs[j+h][1]) && (params[5] + 23 >= logs[j+h][0])) {
					if ((h == 0) && (params[5] <= logs[j+h][0] + 177)) {
						waterloss = 0;
					}
					if ((h == 1) && (params[5] <= logs[j+h][0] + 116)) {
						waterloss = 0;
					}
					if ((h == 2) && (params[5] <= logs[j+h][0] + 84)) {
						waterloss = 0;
					}
				}
			}
		}
	}
	//checks lilypads
	if (params[6] == 78) {
		if (((params[5] > 10) && (params[5] + 23 < 43)) || ((params[5] > 96) && (params[5] + 23 < 129)) || ((params[5] > 180) && (params[5] + 23 < 214)) || ((params[5] > 263) && (params[5] + 23 < 299)) || ((params[5] > 350) && (params[5] + 23 < 382))) {
			waterloss = 1;
		}
	}

	if (waterloss == 1) {
		frogDeath(params,cars,logs);
	}
	if ((carloss == 0) && (waterloss == 0)) {
		if (key == 38) {
			params[0] += 10;
		}
		if (params[6] == 78) {
			params[5] = 188;
			params[6] = 498;
			params[8] += 1;
			params[0] += 50;
			if (params[8] % 5 == 0) {
				params[0] += 1000;
			}
		}
	}
}

function setParams(params,cars,logs) {
	if (params[4] == true) {
		params[0] = 0; //score
		params[1] = 0; //highscore
		params[2] = 1; //level
		params[3] = 4; //lives
		//don't set newgame to false just yet
		params[5] = 188; //frog start x-coordinate
		params[6] = 498; //frog start y-coordinate
		params[7] = 0; //start time is 0
		params[8] = 0; //# of frogs successfully jumped across is 0

		//sets initial car positions
		for (var j=1;j<15;j+=3) {
			for (var h=0;h<3;h++) {
				cars[j+h] = new Array();
				cars[j+h][0] = 150*h + Math.floor(Math.random()*(100));
				cars[j+h][1] = 498-(35*((j+2)/3));
			}
		}

		//sets initial water obstacle positions
		for (var k=1;k<15;k+=3) {
			for (var l=0;l<3;l++) {
				logs[k+l] = new Array();
				logs[k+l][0] = 300*l + Math.floor(Math.random()*(50));
				logs[k+l][1] = 288-(35*((k+2)/3));
			}
		}
	}
	else {
		params[1] = params[0]; //highscore
		params[0] = 0; //score
		params[2] = 1; //level
		params[3] = 4; //lives
		//already in progress
		params[5] = 188; //frog start x-coordinate
		params[6] = 498; //frog start y-coordinate
		params[7] = 0; //start time is 0
		params[8] = 0; //# of frogs successfully jumped across is 0

		//sets initial car positions
		for (var j=1;j<15;j+=3) {
			for (var h=0;h<3;h++) {
				cars[j+h] = new Array();
				cars[j+h][0] = 150*h + Math.floor(Math.random()*(100));
				cars[j+h][1] = 498-(35*((j+2)/3));
			}
		}

		//sets initial water obstacle positions
		for (var k=1;k<15;k+=3) {
			for (var l=0;l<3;l++) {
				logs[k+l] = new Array();
				logs[k+l][0] = 300*l + Math.floor(Math.random()*(50));
				logs[k+l][1] = 288-(35*((k+2)/3));
			}
		}
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
	context.fillText("Level " + params[2],130,547);
	context.font = "bold 11pt arial";
	context.fillText("Score: " + params[0],0,562);
	context.fillText("Highscore: " + params[1],131,562);
}

function drawFrog(sprite,params,context) {
	context.drawImage(sprite,12,369,23,17,params[5],params[6],23,17);
}

function drawObstacles(sprite,params,context) {
	for (var j=1;j<15;j+=3) {
		for (var h=0;h<3;h++) {
			//cars
			if ((j+2)/3 == 1) {
				context.drawImage(sprite,10,267,28,20,cars[j+h][0],cars[j+h][1],28,20);
			}
			if ((j+2)/3 == 2) {
				context.drawImage(sprite,82,264,24,26,cars[j+h][0],cars[j+h][1],24,26);
			}
			if ((j+2)/3 == 3) {
				context.drawImage(sprite,46,265,24,24,cars[j+h][0],cars[j+h][1],24,24);
			}
			if ((j+2)/3 == 4) {
				context.drawImage(sprite,106,302,44,18,cars[j+h][0],cars[j+h][1],44,18);
			}
			if ((j+2)/3 == 5) {
				context.drawImage(sprite,11,301,23,21,cars[j+h][0],cars[j+h][1],23,21);
			}
			//logs
			if (h == 0) {
				context.drawImage(sprite,7,166,177,21,logs[j+h][0],logs[j+h][1],177,21);
			}
			if (h == 1) {
				context.drawImage(sprite,7,198,116,21,logs[j+h][0],logs[j+h][1],116,21);
			}
			if (h == 2) {
				context.drawImage(sprite,7,230,84,21,logs[j+h][0],logs[j+h][1],84,21);
			}
		}
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