/****************** Global variables *****************/

// Canvas
var mCanvas,
	oCanvas;
	
var grid;

var ants = 8;
var antPos;

var directions = Object.freeze({"UP": 2, "RIGHT": 3, "DOWN": 4, "LEFT": 5});
var dirAmount  = 4;
var dir;

const dirArrows = ['↰', '-', '↱', '⇑', '⇒', '⇓', '⇐'];

// Cycles array
var colors = [ 'rgb(255, 255, 255)', 'rgb(0, 255, 0)', 'rgb(255, 0 ,0)', 'rgb(255, 153, 0)', 'rgb(0, 0, 0)'];//, 'rgb(100, 100, 100)', 'rgb(0, 204, 255)', 'rgb(0, 0, 102)', 'rgb(255, 102, 255)', 'rgb(153, 0, 153)', 'rgb(153, 51, 0)', 'rgb(51, 153, 102)'];
//var cycles = randomCycles([-1,0,1]);
var cycles = [ 1, 1, -1, -1, -1];//, 1, -1, -1, -1, 1, 1, 1];
	
/****************** Canvas instances *****************/
	
var mainCanvas = function(p) {
	
	var looping = true;
	
	var btnPause;
	
	var stepsPerFrame;
	var txtSPF;
	
	p.setup = function() {
		
		p.createCanvas(1200, 800);
		p.background(255)
		 .noFill()
		 .strokeWeight(1);
		
		btnPause = p.select("#btnPause");
		txtSPF   = p.select("#txtSPF");
		
		stepsPerFrame = p.select("#sldSPF").value();
		
		// Fill grid with zeros
		p.initGrid();

		// Create ants
		antPos = new Array(ants);
		dir    = new Array(ants);
		for (var i = 0; i < ants; i++) {
			antPos[i] = p.createVector(p.floor(p.random(p.width)), p.floor(p.random(p.height)));
			dir[i]    = p.floor(p.random(dirAmount));
		}
		
	}

	p.draw = function() { p.oneFrame(); }
	
	p.initGrid = function() {
		p.background(255);
		grid = new Array(p.width);
		for (var i = 0; i < p.width; i++) {
			grid[i] = new Array(p.height);
			for (var j = 0; j < grid[i].length; j++)
				grid[i][j] = 0;
		}
	}

	p.pause = function() {
		looping = !looping;
		if (looping) {
			btnPause.html("Pause");
			p.loop();
		}
		else {
			btnPause.html("Resume");
			p.noLoop();
		}
	}
	p.oneStep  = function() { for (var ant = 0; ant < ants; ant++) step(ant); }
	p.oneFrame = function() { for (var n = 0; n < stepsPerFrame; n++) p.oneStep(); }
	
	p.updateSPF = function(spf) { 
		stepsPerFrame = spf; 
		txtSPF.html(spf + " SpF");
	}
	
};
mCanvas = new p5(mainCanvas, 'canvasDiv');

var optionsCanvas = function(p) {
	
	// Big circle
	var radius;
	// Little circles
	var diamC = 25;
	var canvas;
	// Little circle targeted for options modification
	var target;
	
	p.setup = function() {
		
		canvas = p.createCanvas(200, 200);
		p.background(255);
		canvas.mousePressed(p.editColor);
				
		radius = p.floor(p.width * 0.75) / 2.0;
		
	}
	
	p.draw = function() { p.drawCycle(); }
	
	p.drawCycle = function() {
		
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
		var pos, alpha;
		for (var c = 0; c < colors.length; c++) {
			// Polar coordinates
			alpha = ((p.TWO_PI / colors.length) * c) - p.HALF_PI;
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
		
		p.noFill();
		
	}
	
	p.editColor = function() {
		// Click on circle
		target = p.onCircle(p.mouseX, p.mouseY);
		if (target > -1)
			p.showOptions(target);
		else
			p.hideOptions();
	}
	
	p.showOptions = function(index) {
		
		// Setup options
		createColorPicker(colors[index]);
		checkRadioDirection(cycles[target]);
		
		// Turn on visibility
		p.select("#rightOptions")
		 .removeClass("hidden");
		
	}
	
	p.hideOptions = function() {
		p.select("#rightOptions")
		// Avoid adding multiple times
		 .removeClass("hidden")
		 .addClass("hidden");
	}
	
	p.updateColor = function(rgb) { 
		//
		// Not sure if it works
		//
		if (colors.includes(rgb)) {
			console.log("duplicate !");
			return;
		}
		colors[target] = rgb; 
	}
	
	p.updateDir = function(dir) {
		if ((target >= 0) && (dir >= -1) && (dir <= directions.LEFT)) {
			cycles[target] = parseInt(dir);
		}
	}
	
	p.onCircle = function(x,y) {
		// Map mouse position to polar coordinates (relative to center)
		var mouse = p.createVector(p.map(p.mouseX, 0, 200, -3 * diamC, 3 * diamC), p.map(p.mouseY, 0, 200, -3 * diamC, 3 * diamC));
		var alpha, pos;
		for (var c = 0; c < colors.length; c++) {
			// Distance to circle centers
			alpha = ((p.TWO_PI / colors.length) * c) - p.HALF_PI;
			pos   = p.createVector(radius * p.cos(alpha), radius * p.sin(alpha));
			if (p.dist(pos.x, pos.y, mouse.x, mouse.y) <= diamC)
				return c;
		}
		return -1;
	}	
	
};
oCanvas = new p5(optionsCanvas, 'cyclePath');

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

function randomCycles(allow) {
	
	var arr = new Array(colors.length);
	var rnd;
	for (var c = 0; c < colors.length; c++) {
		rnd = Math.floor(Math.random() * dirArrows.length) - 1;
		if (allow != null)
			while (!allow.includes(rnd))
				rnd = Math.floor(Math.random() * dirArrows.length) - 1;
		arr[c] = rnd;	
	}
	return arr;
	
}

function invert(c) {
	
	var r = 255 - oCanvas.red(c),
		g = 255 - oCanvas.green(c),
		b = 255 - oCanvas.blue(c);
	return oCanvas.color(r,g,b);
	
}

function createColorPicker(color) { 

	// Create Color Picker
	var input = document.createElement('BUTTON');
	var picker = new jscolor(input, {
		onFineChange: "oCanvas.updateColor(this.toRGBString())",
		valueElement: null
	});
	picker.fromString(color);
	
	// Cleanup and append again
	var node = document.getElementById("tdColorPicker");
	while (node.lastChild)
		node.removeChild(node.lastChild);
	document.getElementById("tdColorPicker").appendChild(input);
	
}

function checkRadioDirection(value) {
	
	var rad = document.formDir.rdDir;
	for (var i = 0; i < rad.length; i++)
		rad[i].checked = (rad[i].value == value);
	
}