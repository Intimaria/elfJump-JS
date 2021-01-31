document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const doodler = document.createElement('div');
	let isGameOver = false;
	let score = 0;
	let speed = 3;
	let gravity = 0.9;
	let doodlerLeftSpace = 50; 
	let startPoint = 150;
	let doodlerBottomSpace = startPoint;
	let platformCount = 5;
	let platforms = [];
	let firstTime = true;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = false;
	let leftTimerId;
	let rightTimerId;
	let upTimerId;
	let downTimerId;

	
	class Platform {
		constructor(newPlatBottom){
			this.bottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');	
					
			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.left = this.left + 'px';
			visual.style.bottom = this.bottom + 'px';
			grid.appendChild(visual);
		}
	
	}
	
	
	function createPlatforms() {
		for (let i = 0; i < platformCount; i++){
			let platGap = 600 / platformCount;
			let newPlatBottom = 100 + i * platGap;
			let newPlatform = new Platform(newPlatBottom);
			platforms.push(newPlatform);
			console.log(platforms);	
		}

	}
	
	function movePlatforms() {
		if (doodlerBottomSpace > 200) {
			platforms.forEach(platform => {
				platform.bottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';
				
				if (platform.bottom < 10) {
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove('platform');
					platforms.shift();
					score++;
					console.log(platforms);
					let newPlatform = new Platform(600);
					platforms.push(newPlatform);		
				}
			})
		}
	}
	
	function createDoodler(){
		grid.appendChild(doodler);
		doodler.classList.add('doodler');
		doodlerLeftSpace = platforms[0].left;
		doodler.style.left = doodlerLeftSpace + 'px';
		doodler.style.bottom = doodlerBottomSpace + 'px';
	}
	
	function jump() {
		clearInterval(downTimerId);
		isJumping = true;
		upTimerId = setInterval(function () {
			console.log(startPoint);
			console.log('1', doodlerBottomSpace);
			doodlerBottomSpace += 20;
			doodler.style.bottom =  doodlerBottomSpace + 'px';
			console.log('2', doodlerBottomSpace);
			console.log('s', startPoint);
			if (doodlerBottomSpace > startPoint + 200){
				fall();
				isJumping = false;
			}
		}, 40)
		
	}
	
	function fall(){
		clearInterval(upTimerId);
		isJumping = false; 
		downTimerId = setInterval(function() {
			doodlerBottomSpace -= 5;
			doodler.style.bottom = doodlerBottomSpace + 'px';
			if (doodlerBottomSpace <= 0) {
				gameOver();
			}
			platforms.forEach(platform => {
				if (
					(doodlerBottomSpace >= platform.bottom) &&
					(doodlerBottomSpace <= platform.bottom + 15) &&
					((doodlerLeftSpace + 60) >= platform.left) &&
					(doodlerLeftSpace <= (platform.left + 85)) &&
					(!isJumping)
				){
					console.log('landed');
					startPoint = doodlerBottomSpace;
					jump();
					console.log('start', startPoint);
					isJumping = true;
				}
			})
			}, 40)
	}
	

	function control(e) {
		doodler.style.bottom = doodlerBottomSpace + 'px';
		if (e.key === "ArrowLeft"){
			moveLeft();
		}
		else if (e.key === "ArrowRight") {
			moveRight();
		}
		else if (e.key === "ArrowUp") {
			moveStraight();
		}
	}	
	
	function moveLeft() {
		if (isGoingRight){
			clearInterval(rightTimerId);
			isGoingRight = false;
		}
		isGoingLeft = true;
		leftTimerId = setInterval(function() {
			console.log('going left');
			if (doodlerLeftSpace >= 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = doodlerLeftSpace + 'px';	
			} 
			else moveRight();	
		}, 40);
	}
	
	function moveRight() {
		if (isGoingLeft){
			clearInterval(leftTimerId);
			isGoingLeft = false;
		}
		isGoingRight = true;
		rightTimerId = setInterval(function() {
			if (doodlerLeftSpace <= 369){
				doodlerLeftSpace += 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			}
			else moveLeft();
		}, 40)	
	}
	
	function moveStraight() {
		isGoingRight = false;
		isGoingLeft = false;
		clearInterval(rightTimerId);
		clearInterval(leftTimerId);
	}
	
	
	function start() {
		firstTime = false;
		grid.innerHTML = "";
		if (!isGameOver) {
			createPlatforms();
		    createDoodler(); 
			setInterval(movePlatforms, 30);
			jump();
			document.addEventListener('keyup', control);
		}
		else {
			score = 0;
			platforms = [];
			clearInterval(rightTimerId);
			clearInterval(leftTimerId);
			clearInterval(upTimerId);
			clearInterval(downTimerId); 
			createPlatforms();
		    createDoodler(); 
			setInterval(movePlatforms, 50);
			jump();
			document.addEventListener('keyup', control);
		}
		
	 }
	function gameOver() {
		isGameOver = true;
		console.log('game over');
		while (grid.firstChild){
			console.log('remove');
			grid.removeChild(grid.firstChild);
		}
		grid.innerHTML = score;
		clearInterval(upTimerId);
		clearInterval(downTimerId); 
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
	}
	 // attach to button
	 grid.innerHTML = "hit Start";
	 document.getElementById("myBtn").onclick = start;
}) // alternative to putting script inside html


