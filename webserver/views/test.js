// CONST
const MAXFALLSPEED = 500;
const PLAYERSPEED  = 500;

// GLOBAL VARIABLES
let score = 0

// FLAGS
let fruitIsFalling = false
let playerIsMoving = false
let playerIsMovingLeft = false
let gameOverFlag = false

let animationOptions = [
		"Apple", "Banana", "Cherry", "Kiwi", "Melon", "Orange", "Pineapple", "Strawberry"
];

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.

    // Game Objects
	const player        = runtime.objects.Player.getFirstInstance();
	const fruit         = runtime.objects.Fruit.getFirstInstance();
	const keyboard      = runtime.objects.Keyboard;
	const scoreBoard    = runtime.objects.ScoreBoard.getFirstInstance();
	const gameOverTitle = runtime.objects.GameOverTitle.getFirstInstance();
	const gameOverText  = runtime.objects.TryAgainText.getFirstInstance();
    const dt            = runtime.dt;

    let fruitSpeed      = 200 // inital speed

    runtime.addEventListener("tick", () => Tick(
        runtime, player, fruit, keyboard, scoreBoard, gameOverTitle, gameOverText, dt, fruitSpeed
    ));
}

function Tick(player, fruit, keyboard, scoreBoard, gameOverTitle, gameOverText, dt, fruitSpeed) {
	if (gameOverFlag) {
		gameOverTitle.text = "Game Over!"
		gameOverText.text = "Press 'E' to try again."
		if (keyboard.isKeyDown("KeyE")) resetGame(gameOverTitle, gameOverText, fruitSpeed);
	}

    // Update Game
    updateScoreBoard(scoreBoard);
	updatefruit(dt, player, fruit, fruitSpeed);
	updatePlayer(player, dt);
}

function resetGame(gameOverTitle, gameOverText, fruitSpeed) {
    // Global & Flags
    score = 0;
    gameOverFlag = false;
    fruitIsFalling = false;

    gameOverTitle.text = ""
    gameOverText.text = ""
    fruitSpeed = 200
}	

function collided(player, fruit) {
	return (
        player.x < fruit.x       + fruit.width  &&
		player.x + player.width  > fruit.x      &&
		player.y < fruit.y       + fruit.height &&
		player.y + player.height > fruit.y
    );
}

function updateScoreBoard(scoreBoard) {
	scoreBoard.text = "Score: " + score;
}

function resetFruit(fruit) {
    fruit.x        = Math.random() * (750 - 30) + 30;
    fruit.y        = 10;
    fruitIsFalling = true;
    
    fruit.setAnimation(animationOptions[Math.floor(Math.random()*animationOptions.length)]);
}

function updatefruit(dt, player, fruit, fruitSpeed) {
	if (!fruitIsFalling) resetFruit(fruit);
	
	fruit.y += fruitSpeed * dt;

	if (collided(player, fruit)) {
		fruitIsFalling = false;
		score += 1;
		if (fruitSpeed < MAXFALLSPEED) fruitSpeed += 10;
	}
	else if (fruit.y >= 600) gameOverFlag = true;
	
}

function updatePlayer(player, dt) {
    playerController(player, dt);
    playerAnimation(player)
}

function playerController(dt, player) {
	
	if (keyboard.isKeyDown("KeyA") || keyboard.isKeyDown("ArrowLeft")) {
		player.x           -= PLAYERSPEED * dt;
		playerIsMoving     = true;
		playerIsMovingLeft = true;
		return;
	}
	
	if (keyboard.isKeyDown("KeyD") || keyboard.isKeyDown("ArrowRight")) {
		player.x           += PLAYERSPEED * dt;
		playerIsMoving     = true;
		playerIsMovingLeft = false;
		return;
	}

	playerIsMoving     = false;
	playerIsMovingLeft = false;
}

function playerAnimation(player) {
	if (playerIsMoving) {
		if (playerIsMovingLeft) player.setAnimation("RunLeft");
		else player.setAnimation("Run");

	} else player.setAnimation("Idle");
}