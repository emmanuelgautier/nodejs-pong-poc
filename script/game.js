var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var cursors;
var paddles, paddle1, paddle2;
var ball;
var walls, goals;
 
function preload() {
	//Load the sprites
	game.load.image('paddle', 'assets/sprite/paddle.png');
	game.load.image('ball', 'assets/sprite/ball.png');
	game.load.image('wall', 'assets/sprite/horizontalLimit.png');
	game.load.image('goal', 'assets/sprite/goal.png');
}
 
function create() {
	//Enable physic system
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//Create the limits
	walls = game.add.group();
	walls.enableBody = true;
	wall = walls.create(50, -1, "wall");
	wall = walls.create(0, 600, "wall");
	goals = game.add.group();
	goals.enableBody = true;
	goal = goals.create(-1, 0, "goal");
	goal = goals.create(800, 0, "goal");

	//Create paddles group
	paddles = game.add.group();
	paddle1 = paddles.create(20, 250, "paddle");
	paddle2 = paddles.create(760, 250, "paddle");

	//Create the ball
	ball = game.add.sprite(392.5, 292.5, "ball");
	game.physics.arcade.enable(ball);

	//Add initial momentum to the ball
	ball.body.velocity.x = 300;
	ball.body.velocity.y = 300 * (Math.random() * 2 - 1);

	//Enable physic on both paddle
	game.physics.arcade.enable(paddle1);
	paddle1.body.collideWorldBounds = true;
	paddle1.body.immovable = true;
	game.physics.arcade.enable(paddle2);
	paddle2.body.collideWorldBounds = true;
	paddle2.body.immovable = true;

	

	cursors = game.input.keyboard.createCursorKeys();
}
 
function update() {
	//Collision check
	game.physics.arcade.collide(ball, paddles, bounceBackX, null, this);
	game.physics.arcade.overlap(ball, walls, bounceBackY, null, this);
	game.physics.arcade.overlap(ball, goals, score, null, this);

	if (cursors.up.isDown)
    {
        paddle1.body.velocity.y = -250;
        paddle2.body.velocity.y = -250;
    }
    else if (cursors.down.isDown)
    {
        paddle1.body.velocity.y = 250;
        paddle2.body.velocity.y = 250;
    }
    else{
    	paddle1.body.velocity.y = 0;
    	paddle2.body.velocity.y = 0;
    }
}

function bounceBackY(ball, wall){
	ball.body.velocity.y *= -1;
}

function bounceBackX(ball, paddle){
	ball.body.velocity.x *= -1.1;
	if(ball.body.velocity.x > 1500)
		ball.body.velocity.x = 1500;
	else if(ball.body.velocity.x < -1500)
		ball.body.velocity.x = -1500;
	console.log(ball.body.velocity.x);
}

function score(ball, goal){
	ball.body.x = 392.5;
	ball.body.y = 292.5;
	ball.body.velocity.x = 300;
	ball.body.velocity.y = 300 * (Math.random() * 2 - 1);
}