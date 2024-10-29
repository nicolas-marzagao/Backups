class CatchTheFruit {
    // Objects
    player;
    fruit;
    keyboard;
    scoreBoard;
    gameOverTitle;
    gameOverText;
    dt;

    // Flags
    gameOverFlag = false;

    // Constructor (Game Init)
    constructor(runtime) {
        this.keyboard      = runtime.objects.Keyboard;
        this.scoreBoard    = runtime.objects.ScoreBoard.getFirstInstance();
        this.gameOverTitle = runtime.objects.GameOverTitle.getFirstInstance();
        this.gameOverText  = runtime.objects.GameOverText.getFirstInstance();
        this.dt            = runtime.dt;
        this.player        = new Player(this.runtime, this.keyboard, this.dt);
        this.fruit         = new Fruit(this.runtime, this.dt, this.player);
    }

    update() {
        if (this.gameOverFlag) {
            this.gameOverTitle.text = "Game Over!";
            this.gameOverText.text = "Press 'E' to try again.";

            if (this.keyboard.isKeyDown("KeyE")) this.reset();
        }

        this.updateScore();
        this.player.update();

        this.gameOverFlag = this.fish.update();
    }

    updateScore() {
        this.scoreBoard.text = "Score: " + SCORE;
    }

    reset() {
        // Reset Game Variables & Flags
        SCORE                   = 0;
        this.gameOverFlag       = false;
        this.gameOverTitle.text = "";
        this.gameOverText.text  = "";

        // Reset Fruit Variables & Flags
        this.fruit.isFalling           = false;
        this.fruit.currentFallingSpeed = 200;
    }
}

class Player {
    // variable
    speed = 500;

    // Objects
    keyboard;
    object;
    dt;

    // Flags
    IsMoving = false;
    IsMovingLeft = false;

    constructor(runtime, dt, keyboard) {
        this.dt = dt;
        this.object = runtime.objects.Player.getFirstInstance();
        this.speed = 500;
        this.keyboard = keyboard;
    }

    update() {
        this.controller();
        this.animation();
    }

    controller() {
        if (this.keyboard.isKeyDown("KeyA") || this.keyboard.isKeyDown("ArrowLeft")) {
            this.object.x     -= this.speed * this.dt;
            this.IsMoving     = true;
            this.IsMovingLeft = true;
            return;
        }

        if (this.keyboard.isKeyDown("KeyW") || this.keyboard.isKeyDown("ArrowRight")) {
            this.object.x     += this.speed * this.dt;
            this.IsMoving     = true;
            this.IsMovingLeft = false;
            return;
        }

        this.IsMoving     = false;
        this.IsMovingLeft = false;
    }

    animation() {
        if (this.IsMoving) {
            if (this.IsMovingLeft) this.object.setAnimation("RunLeft");
            else this.object.setAnimation("Run");
        } else   this.object.setAnimation("Idle");
    }
}

class Fruit {
    // Variables
    maxFallSpeed        = 500;
    currentFallingSpeed = 200;

    animationOptions = [
		"Apple", 
        "Banana", 
        "Cherry",
        "Kiwi", 
        "Melon", 
        "Orange", 
        "Pineapple", 
        "Strawberry"
    ];


    // Objects
    player;
    object;
    dt;

    // Flags
    isFalling = false;

    constructor(runtime, dt) {
        this.dt = dt;
        this.object = runtime.object.Fish.getFirstInstance();
    }

    update() {
        if (!this.isFalling) this.reset();

        this.object.y += this.currentFallingSpeed * this.dt;
        if (this.colisionAABB()) {
            this.isFalling = false;
            SCORE += 1;
            this.updateFishSpeed();
        }

        else if (this.object.y >= 600) return true;
        else return false;
    }

    reset() {
        let randomAnimation = Math.floor(Math.random()*this.animationOptions.length)
	
		this.object.x = Math.random() * (750 - 30) + 30;
		this.object.y = 10;
		this.isFalling = true;
		this.object.setAnimation(this.animationOptions[randomAnimation]);
    }

    colisionAABB() {
        return (
            this.player.x < this.object.x + this.object.width  &&
            this.player.x + this.player.width > this.object.x  &&
            this.player.y < this.object.y + this.object.height &&
            this.player.y + this.player.height > this.object.y
        );
    }

}

let SCORE = 0;
let catchTheFruit;

runOnStartup(async runtime =>
{
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
    catchTheFruit = new CatchTheFruit();
}

function Tick(runtime)
{
    catchTheFruit.update();
}