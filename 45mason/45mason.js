
function findoutMOver() {
	document.getElementById("findout").style.backgroundColor="rgba(255,191,0,1.0)";
	document.getElementById("findout").style.cursor="pointer";
}
function findoutMOut() {
	document.getElementById("findout").style.backgroundColor="rgba(255,191,0,0.6)";
	document.getElementById("findout").style.cursor="default";
}
function aboutusMOver() {
	document.getElementById("findoutmore").style.backgroundColor="rgb(115,205,210)";
	document.getElementById("findoutmore").style.border="2px solid rgb(115,205,210)";
	document.getElementById("findoutmore").style.color="white";
	document.getElementById("findoutmore").style.cursor="pointer";
}
function aboutusMOut() {
	document.getElementById("findoutmore").style.backgroundColor="white";
	document.getElementById("findoutmore").style.border="2px solid rgb(100,100,100)";
	document.getElementById("findoutmore").style.color="rgb(100,100,100)";
	document.getElementById("findoutmore").style.cursor="default";
}
function promptORM() {
	document.getElementById('ormslider').classList.toggle('closed');
	document.getElementById('logo').style.top="-9000px";
}
function closeORM() {
	document.getElementById('ormslider').classList.toggle('closed');
	document.getElementById('logo').style.top="60px";
	document.getElementById('inputBBP').children[0].value="";
	document.getElementById('inputBOP').children[0].value="";
	document.getElementById('inputBC').children[0].value="";
	document.getElementById('outputBBP').innerHTML=0;
	document.getElementById('outputBOP').innerHTML=0;
	document.getElementById('outputBC').innerHTML=0;
}
function calculateORM() {
	if (document.getElementById('inputBBP').children[0].value > 0) {
		num = document.getElementById('inputBBP').children[0].value;
		num = num*(350/275);
		num = Math.round(num*10)/10;
		document.getElementById('outputBBP').innerHTML = num;
	} else {
		document.getElementById('outputBBP').innerHTML = 0;
	}
	if (document.getElementById('inputBOP').children[0].value > 0) {
		num = document.getElementById('inputBOP').children[0].value;
		num = num*(350/275);
		num = Math.round(num*10)/10;
		document.getElementById('outputBOP').innerHTML = num;
	} else {
		document.getElementById('outputBOP').innerHTML = 0;
	}
	if (document.getElementById('inputBC').children[0].value > 0) {
		num = document.getElementById('inputBC').children[0].value;
		num = num*(350/275);
		num = Math.round(num*10)/10;
		document.getElementById('outputBC').innerHTML = num;
	} else {
		document.getElementById('outputBC').innerHTML = 0;
	}
}
