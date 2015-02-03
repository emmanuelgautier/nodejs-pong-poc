var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var cursors1;
var cursors2Up, cursors2Down;
var paddles, paddle1, paddle2;
var ball;
var speed = 300, speedLimit = 1500;
var walls, wall, goals, goal;
var vector = {
    x: 0,
    y: 0
};
var length;
var score1 = 0, score2 = 0;
var scoreDisplay;
 
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
	paddle2 = paddles.create(20, 250, "paddle");
	paddle1 = paddles.create(760, 250, "paddle");

	//Create the ball
	ball = game.add.sprite(392.5, 292.5, "ball");
	game.physics.arcade.enable(ball);

	//Add initial momentum to the ball
	ball.body.velocity.x = speed;
	ball.body.velocity.y = speed * (Math.random() * 1.5 - 0.75);

	//Enable physic on both paddle
	game.physics.arcade.enable(paddle1);
	paddle1.body.collideWorldBounds = true;
	paddle1.body.immovable = true;
	game.physics.arcade.enable(paddle2);
	paddle2.body.collideWorldBounds = true;
	paddle2.body.immovable = true;

    //Create score
    scoreDisplay = game.add.text(350, 20, "0 : 0", { font: "40px Arial", fill: "#ffffff", align: "center" });
    scoreDisplay.x = (game.width - scoreDisplay.width)/2;
    
	cursors1 = game.input.keyboard.createCursorKeys();
    cursors2Up = game.input.keyboard.addKey(90);
    cursors2Down = game.input.keyboard.addKey(83);
}
 
function update() {
	//Collision check
	game.physics.arcade.collide(ball, paddles, bounceBackX, null, this);
	game.physics.arcade.overlap(ball, walls, bounceBackY, null, this);
	game.physics.arcade.overlap(ball, goals, score, null, this);
    
    //Reset if ball fall out of bounds
    if(ball.inWorld === false){
        ball.body.x = 392.5;
	    ball.body.y = 292.5;
        speed = 300;
        ball.body.velocity.x = speed;
	    ball.body.velocity.y = speed * (Math.random() * 1.5 - 0.75);
    }
    
    //Display score
    

    //Move the paddles
	if (cursors1.up.isDown)
    {
        paddle1.body.velocity.y = -300;
    }
    else if (cursors1.down.isDown)
    {
        paddle1.body.velocity.y = 300;
    }
    else{
    	paddle1.body.velocity.y = 0;
    }
    if (cursors2Up.isDown)
    {
        paddle2.body.velocity.y = -300;
    }
    else if (cursors2Down.isDown)
    {
        paddle2.body.velocity.y = 300;
    }
    else{
        paddle2.body.velocity.y = 0;
    }
}

//Bounce to a wall
function bounceBackY(ball, wall){
	ball.body.velocity.y *= -1;
}

//Bounce to a paddle
function bounceBackX(ball, paddle){
    //Augment ball speed
    speed *= 1.1;
    if(speed > speedLimit){
		speed = speedLimit;
    }
    vector.x = ball.body.center.x - paddle.body.center.x;
    vector.y = (ball.body.center.y - paddle.body.center.y)/2;
    length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
    vector.x *= speed / length; 
    vector.y *= speed / length; 
	ball.body.velocity.x = vector.x;
	ball.body.velocity.y = vector.y;
}

//Score a point
function score(ball, goal){
    //Refresh score
    if(goal.body.x < 400){
        score2++;
    } else{
        score1++;
    }
    scoreDisplay.setText(score1 + " : " + score2);
    scoreDisplay.x = (game.width - scoreDisplay.width)/2;
    
	ball.body.x = 392.5;
	ball.body.y = 292.5;
    paddle1.body.y = 250;
    paddle2.body.y = 250;
    speed = 300;
	ball.body.velocity.x = speed;
	ball.body.velocity.y = speed * (Math.random() * 1.5 - 0.75);
}