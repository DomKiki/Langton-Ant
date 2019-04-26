/****************** Global variables *****************/

// Canvas
var mCanvas,
	pCanvas;
	
var grid;

var ants = 5;
var antPos;
var cyclesPerFrame = 1000;

var directions = Object.freeze({"UP": 2, "RIGHT": 3, "DOWN": 4, "LEFT": 5});
var dirAmount  = 4;
var dir;

const dirArrows = ['↰', '-', '↱', '⇑', '⇒', '⇓', '⇐'];

// Cycles array
var colors = [ 'white', 'red', 'lime', 'rgb(255, 153, 0)', 'black', 'darkgray', 'rgb(0, 204, 255)', 
			   'rgb(0, 0, 102)', 'rgb(255, 102, 255)', 'rgb(153, 0, 153)', 'rgb(153, 51, 0)', 'rgb(51, 153, 102)'];
var cycles = randomCycles();
//var cycles = [ 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1];
	
/****************** Canvas instances *****************/
	
var mainCanvas = function(p) {
	
	p.setup = function() {
		
		p.createCanvas(800, 600);
		
		p.background(255);
		p.noFill();
		
		// Fill grid with zeros
		grid = new Array(p.width);
		for (var i = 0; i < p.width; i++) {
			grid[i] = new Array(p.height);
			for (var j = 0; j < grid[i].length; j++)
				grid[i][j] = 0;
		}

		// Create ants
		antPos = new Array(ants);
		dir    = new Array(ants);
		for (var i = 0; i < ants; i++) {
			antPos[i] = p.createVector(p.floor(p.random(p.width)), p.floor(p.random(p.height)));
			dir[i]    = p.floor(p.random(dirAmount));
		}
		
	}

	p.draw = function() {
		
		p.strokeWeight(1);
		for (var n = 0; n < cyclesPerFrame; n++)
			for (var ant = 0; ant < ants; ant++)
				step(ant);
			
	}
};
mCanvas = new p5(mainCanvas, 'canvasDiv');

var pathCanvas = function(p) {
	
	var radius;
	
	p.setup = function() {
		
		p.createCanvas(200, 200)
		 .background(255);
				
		radius = p.floor(p.width * 0.75) / 2.0;
		
	}
	
	p.draw = function() {
		
		var d = [p.width / 2, p.height / 2];
		var offset = 40;
		// 360° arrow
		p.noStroke()
		 .fill(0)
		 .textSize(80)
		 .textAlign(p.CENTER, p.CENTER)
		 .text('⟳', d[0] + 3, d[1] + 8);
		// Circle
		p.stroke(0)
		 .noFill()
		 .strokeWeight(2)
		 .ellipse(d[0], d[1], radius * 2)
		 .translate(d[0], d[1]);
		
		// Path
		var pos, alpha,
			diamC = 25;
		for (var c = 0; c < colors.length; c++) {
			// Polar coordinates
			alpha = (p.TWO_PI / colors.length) * c;
			pos   = p.createVector(radius * p.cos(alpha), radius * p.sin(alpha));
			// Circle
			p.fill(colors[c])
		     .strokeWeight(0.5)
			 .ellipse(pos.x, pos.y, diamC);
			// Direction
			p.noStroke()
			 .fill(invert(colors[c]))
			 .textSize(20)
			 .text(dirArrows[cycles[c] + 1], pos.x, pos.y);
		}
		
		p.noFill()
		 .noLoop();
	}
	
};
pCanvas = new p5(pathCanvas, 'pathDiv');

/************************ Turns **********************/

function turn(ant) {
	
	var p = antPos[ant];
	var g = grid[p.x][p.y];
	var d = (g + 1) % cycles.length;
	// Color pixel
	mCanvas.stroke(mCanvas.color(colors[d]));
	mCanvas.point(p.x, p.y);
	// Update direction
	if (mCanvas.abs(cycles[g]) > 1)
		dir[ant] = cycles[g];
	else
		dir[ant] = (dir[ant] + cycles[g] + dirAmount) % dirAmount;
	// Set grid value
	grid[p.x][p.y] = d;
	
	
}

function step(ant) {
	
	// Turn
	turn(ant);
	
	// Apply move
	var m = mCanvas.createVector(0,0);
	switch(dir[ant] + directions.UP) {
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
	antPos[ant].x = (antPos[ant].x + mCanvas.width)  % mCanvas.width;
	antPos[ant].y = (antPos[ant].y + mCanvas.height) % mCanvas.height;
	
}

/************************* Misc **********************/

function randomCycles() {
	
	var arr = new Array(colors.length);
	for (var c = 0; c < colors.length; c++)
		arr[c] = Math.floor(Math.random() * dirArrows.length) - 1;
	return arr;
	
}
function invert(c) {
	
	var r = 255 - pCanvas.red(c),
		g = 255 - pCanvas.green(c),
		b = 255 - pCanvas.blue(c);
	return pCanvas.color(r,g,b);
	
}