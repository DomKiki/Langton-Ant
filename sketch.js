/****************** Global variables *****************/

// Canvas
var canvas;

var grid;

var ants = 5;
var antPos;
var cyclesPerFrame = 1000;

var directions = Object.freeze({"UP": 0, "RIGHT": 1, "DOWN": 2, "LEFT": 3});
var dirAmount  = 4;
var dir;

// Equivalencies array (index is src)
var cycles = [ 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1];
var colors = [ 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(255, 153, 0)', 'rgb(0, 0, 0)', 'rgb(127, 127, 127)',
               'rgb(0, 204, 255)', 'rgb(0, 0, 102)', 'rgb(255, 102, 255)', 'rgb(153, 0, 153)', 'rgb(153, 51, 0)', 'rgb(51, 153, 102)'];

/********************* p5 Methods ********************/

function setup() {
	
	canvas = createCanvas(800, 600);	
	canvas.parent("canvasDiv");
	
	background(255);
	noFill();
	
	grid = new Array(width);
	for (var i = 0; i < width; i++) {
		grid[i] = new Array(height);
		for (var j = 0; j < grid[i].length; j++)
			grid[i][j] = 0;
	}

	antPos = new Array(ants);
	dir    = new Array(ants);
	for (var i = 0; i < ants; i++) {
		var v = createVector(floor(random(width)), floor(random(height)));
		antPos[i] = v;
		dir[i] = floor(random(dirAmount));
	}
	
}

function draw() {
	
	strokeWeight(1);
	for (var n = 0; n < cyclesPerFrame; n++)
		for (var ant = 0; ant < ants; ant++)
			step(ant);
		
}

/************************ Turns **********************/

function turn(ant) {
	
	var p = antPos[ant];
	var g = grid[p.x][p.y];
	var d = (g + 1) % cycles.length;
	// Color pixel
	stroke(color(colors[d]));
	point(p.x, p.y);
	// Update direction
	dir[ant] = (dir[ant] + cycles[g] + dirAmount) % dirAmount;
	// Set grid value
	grid[p.x][p.y] = d;
	
}

function step(ant) {
	
	// Turn
	turn(ant);
	
	// Apply move
	var m = createVector(0,0);
	switch(dir[ant]) {
		case directions.UP:
			m.y = -1;
			break;
		case directions.RIGHT:
			m.x = 1;
			break;
		case directions.DOWN:
			m.y = 1;
			break;
		case directions.LEFT:
			m.x = -1;
			break;
		default:
			break;
	}
	antPos[ant].add(m);
	
	// Wrap world on itself
	antPos[ant].x = (antPos[ant].x + width)  % width;
	antPos[ant].y = (antPos[ant].y + height) % height;
	
}