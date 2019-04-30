var optionsCanvas = function(p) {
	
	// Big circle
	var radius;
	// Little circles
	var diamC = 25;
	var canvas;
	// Little circle targeted for options modification
	var target;
	
	var btnAddNode;
	var btnRemoveNode;
	var divRightOptions;
	
	p.setup = function() {
		
		canvas = p.createCanvas(200, 200);
		p.background(255);
		canvas.mousePressed(p.editColor);
				
		radius = p.floor(p.width * 0.75) / 2.0;
		
		btnAddNode = p.select("#btnAddNode");
		btnAddNode.mousePressed(p.addNode);
		btnRemoveNode = p.select("#btnRemoveNode");
		btnRemoveNode.mousePressed(p.removeNode);
		
		divRightOptions = p.select("#rightOptions");
		
		var ctnr = p.select("#tdRadioDir");
		var radios = p.selectAll("input", ctnr);
		for (var r = 0; r < radios.length; r++)
			// As .changed() doesn't allow callbacks with arguments...
			radios[r].attribute('onchange', 'oCanvas.updateDir(this.value)');
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
			 .fill(p.invert(colors[c]))
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
			p.hide(divRightOptions);
	}
	
	p.showOptions = function(index) {
		
		// Setup options
		createColorPicker(colors[index]);
		checkRadioDirection(cycles[target]);
		if (cycles.length <= 2)
			p.hide(btnRemoveNode);
		
		// Turn on visibility
		divRightOptions.removeClass("hidden");
		
	}
	
	p.hide = function(el) {
		p.select(el);
		if (el != null)
		// Avoid adding multiple times
			el.removeClass("hidden")
		      .addClass("hidden");
	}
	
	p.updateColor = function(rgb) { 
		//
		// Uncertain behaviour, array won't be affected but the ColorPicker will
		//
		if (colors.includes(rgb))
			return;
		colors[target] = rgb; 
	}
	
	p.updateDir = function(dir) {
		if ((dir >= -1) && (dir <= directions.LEFT)) {
			cycles[target] = parseInt(dir);
			p.clearCanvas();
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
	
	p.addNode = function() {
		
		// Random settings
		var c = p.floor(p.random() * dirArrows.length) - 1;
		var r, g, b, col;
		do {
			r   = p.round(p.random(255));
			g   = p.round(p.random(255));
			b   = p.round(p.random(255));
			col = 'rgb(' + r + ',' + g + ',' + b + ')';
		} while (colors.includes(col));
		colors.push(col);
		cycles.push(c);
		
		// Reset
		p.resetCycle();
		
	}
	
	p.removeNode = function() {
		if ((target >= 0) && (target < cycles.length)) {
			// Remove values from arrays
			colors.splice(target, 1);
			cycles.splice(target, 1);
			// Reset grid and cycle canvas, clear screen
			mCanvas.clear();
			p.resetCycle();
		}
	}
	
	p.clearCanvas = function() {
		p.translate(-p.width / 2, -p.height / 2)
		 .noStroke()
		 .fill(255)
		 .rect(0,0,p.width,p.height);
	}
	
	p.resetCycle = function() {
		target = -1;
		p.hide(divRightOptions);
		p.clearCanvas();
		p.drawCycle();
	}
	
	p.invert = function(c) {
		return oCanvas.color(255 - p.red(c),
							 255 - p.green(c),
							 255 - p.blue(c));
	}
	
};