var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, restart, score;
var gameOverImg, restartImg;

var mario, mario_walk, mario_collided;
var backGrnd, ground, invisibleGround, groundImage;

var brick, pitcher;
var bricksGroup, pitcherGroup;
var pitcherImage, brickImage;

var jumpSound, checkPointSound, dieSound;
var score;


function preload() {
  backGrnd = loadImage("bg.png");

  mario_walk = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadImage("collided.png");

  pitcherImage = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png")
  brickImage = loadImage("brick.png");
  groundImage = loadImage("ground2.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 400);

  //mario
  mario = createSprite(50, 300, 50, 40);
  mario.addAnimation("walk", mario_walk);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1.5;

  //ground and invisible ground
  invisibleGround = createSprite(200, 347, 400, 10)
  invisibleGround.visible = false;
  ground = createSprite(300, 378, 60, 42)
  ground.addImage("brick", groundImage);

  //gameover and restart
  gameOver = createSprite(300, 75);
  gameOver.addImage(gameOverImg);
  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  //grouping
  bricksGroup = createGroup();
  pitcherGroup = createGroup();

  fill(0)
  textSize(24);
  score = 0;

  mario.setCollider("circle", 0, 0, 17);
  mario.debug = true
}

function draw() {
  background(backGrnd);
  mario.collide(invisibleGround);
  text("Score: " + score, 470, 30);

  //gamestate is play
  if (gameState === PLAY) {
    
    score = score + Math.round(getFrameRate() / 60);
    
    ground.velocityX = -(6 + 3*score/100);

    //restart not visible
    gameOver.visible = false;
    restart.visible = false;
    mario.changeAnimation("walk", mario_walk);

    //moving and infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    //Jump
    if (keyDown("space") && mario.y >= 300) {
      mario.velocityY = -15;
      jumpSound.play();
    }
    //gravity
    mario.velocityY = mario.velocityY + 0.8;

    //bricks and obstacle
    spawnBricks();
    spawnPitcher();

    //scoring
    for (var i = 0; i < bricksGroup.length; i++) {
      if (mario.isTouching(bricksGroup.get(i))) {
        score = score + 1;
        bricksGroup.get(i).destroy();
      }
    }

    //change the mario animation
    for (var j = 0; j < pitcherGroup.length; j++) {
      if (mario.isTouching(pitcherGroup.get(j))) {
        mario.changeAnimation("collided", mario_collided);
        dieSound.play();
        gameState = END;
      }
    }
  }


  // gamestate = end
  else if (gameState === END) {

    //gameover and restart visible
    gameOver.visible = true;
    restart.visible = true;

    //keep everything on place
    ground.velocityX = 0;
    mario.velocityY = 0;
    mario.y = 310;

    if (mousePressedOver(restart)) {
      reset();
    }

    //set lifetime of the game objects so that they are never destroyed
    pitcherGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    pitcherGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
  }

  // spawn Bricks
  function spawnBricks() {
    if (frameCount % 60 == 0) {
      brick = createSprite(600, 200, 50, 15);
      brick.addImage(brickImage);
      brick.y = Math.round(random(160, 200));
      brick.velocityX = -5;
      brick.scale = 0.9;
      brick.lifetime = 200;
      bricksGroup.add(brick);
    }
  }

  // spawn Pitcher
  function spawnPitcher() {
    if (frameCount % 60 == 0) {
      pitcher = createSprite(600, 312, 50, 40);
      pitcher.addAnimation("pitch", pitcherImage);
      pitcher.velocityX = -10;
      pitcher.scale = 1.1;
      pitcher.lifetime = 200;
      pitcherGroup.add(pitcher);
    }
  }
  drawSprites();

  function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    pitcherGroup.destroyEach();
    bricksGroup.destroyEach();
    score = 0;
  }
}