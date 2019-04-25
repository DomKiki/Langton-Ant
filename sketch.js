/****************** Global variables *****************/

// Canvas
var canvas;
var canvasDim    = [800, 600];

/********************* p5 Methods ********************/

function setup() {
	
	canvas = createCanvas(canvasDim[0], canvasDim[1]);	
	canvas.parent("canvasDiv");
	
}

function draw() {

	initCanvas();
	
}

/********************* Initialize ********************/

function initCanvas() {
	
	background(255);
	noFill();
	
}