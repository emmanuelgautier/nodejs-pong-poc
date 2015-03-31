(function(Phaser) {
    'use strict';

    var socket = io('/');
    var _config = {};

    var game = null;

    var cursors1;
    var cursors2Up, cursors2Down;
    var paddles, paddle1, paddle2;
    var ball;
    var walls, wall, goals, goal;
    var score1 = 0, score2 = 0;
    var scoreDisplay;

    var pauseButton = null, speed; 

    socket.emit('preload config');
    socket.on('config', function(config){
        _config = config;

        init();
    });

    socket.on('start', function(){
        console.log("it started!");

        togglePause();
    });

    socket.on('positions', function(positions) {
        console.log(positions);
    });

    function init() {
        game = new Phaser.Game(_config.map.width, _config.map.height, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    }

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
        wall = walls.create(_config.objects.wall.position[0].x, _config.objects.wall.position[0].y, "wall");
        wall = walls.create(_config.objects.wall.position[1].x, _config.objects.wall.position[1].y, "wall");
        goals = game.add.group();
        goals.enableBody = true;
        goal = goals.create(_config.objects.goal.position[0].x, _config.objects.goal.position[0].y, "goal");
        goal = goals.create(_config.objects.goal.position[1].x, _config.objects.goal.position[1].y, "goal");

        //Create paddles group
        paddles = game.add.group();
        paddle2 = paddles.create(_config.objects.paddle.position[0].x, _config.objects.paddle.position[0].y, "paddle");
        paddle1 = paddles.create(_config.objects.paddle.position[1].x, _config.objects.paddle.position[1].y, "paddle");

        //Create the ball
        ball = game.add.sprite(_config.objects.ball.position.x, _config.objects.ball.position.x, "ball");
        game.physics.arcade.enable(ball);

        //Add initial momentum to the ball
        ball.body.velocity.x = _config.velocity.ball.min;
        ball.body.velocity.y = _config.velocity.ball.min * (Math.random() * 1.5 - 0.75);

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
        pauseButton = game.input.keyboard.addKey(32);
            pauseButton.onDown.add(togglePause, this);

        socket.emit('ready');
    }
     
    function update() {
        //Collision check
        game.physics.arcade.collide(ball, paddles, bounceBackX, null, this);
        game.physics.arcade.overlap(ball, walls, bounceBackY, null, this);
        game.physics.arcade.overlap(ball, goals, score, null, this);
        
        //Reset if ball fall out of bounds
        if(ball.inWorld === false){
            ball.body.x = _config.objects.goal.position.x;
            ball.body.y = _config.objects.goal.position.y;
            speed = _config.velocity.ball;
            ball.body.velocity.x = _config.velocity.ball.min;
            ball.body.velocity.y = _config.velocity.ball.min * (Math.random() * 1.5 - 0.75);
        }
        
        //Display score
        

        //Move the paddles
        if (cursors1.up.isDown)
        {
            paddle1.body.velocity.y = -_config.velocity.paddle;
        }
        else if (cursors1.down.isDown)
        {
            paddle1.body.velocity.y = _config.velocity.paddle;
        }
        else{
            paddle1.body.velocity.y = 0;
        }
        if (cursors2Up.isDown)
        {
            paddle2.body.velocity.y = -_config.velocity.paddle;
        }
        else if (cursors2Down.isDown)
        {
            paddle2.body.velocity.y = _config.velocity.paddle;
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
        var vector = {
            x: 0,
            y: 0
        };

        //Augment ball speed
        speed *= 1.1;
        if(speed > _config.velocity.ball.max){
            speed = _config.velocity.ball.max;
        }
        vector.x = ball.body.center.x - paddle.body.center.x;
        vector.y = (ball.body.center.y - paddle.body.center.y)/2;
        var length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
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

    //Toggle the paused state of the game
    function togglePause() {
        game.paused ? game.paused = false : game.paused = true;
    }
})(Phaser);
