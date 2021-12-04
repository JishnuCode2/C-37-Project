/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle, gameOverImg, restartImg;

var obstaclesGroup, obstacle1;
var shrubsGroup;
var score=0;
var Win, Score;
var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)
  kangaroo.debug=true;
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  gameOver = createSprite(400,130);
  gameOver.addImage("gameOver",gameOverImg);
  gameOver.visible = false;

  restart = createSprite(400,200);
  restart.addImage("restart",restartImg);
  restart.scale = 0.1;
  restart.visible = false

  Win = createElement("h2");
  Win.position(400,200);
  Score = createElement("h2");

}

function draw() {
  background(255);
  
  kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){
    kangaroo.visible = true;
    jungle.visible = true;
    jungle.velocityX=-(3+2*score/3);
    Score.position(20,10);
    Score.html("Score: "+score);
    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();
    restart.visible = false;
    gameOver.visible = false;

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score+=1;
      shrubsGroup.destroyEach();
    }
    if(score>=15){
        gameState = WIN
    }
  }
  else if (gameState === END) {
    //set velcity of each game object to 0
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    restart.visible = true;
    gameOver.visible = true;
    shrubsGroup.setVelocityXEach(0);

    //change the kangaroo animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    

  }
  else if(gameState === WIN){
     win()
  }
  if(mousePressedOver(restart) && restart.visible === true){
        gameState = PLAY;
        obstaclesGroup.destroyEach();
        shrubsGroup.destroyEach();
        kangaroo.changeAnimation("running",kangaroo_running);
        score = 0;
    }
  
  drawSprites();


}

function win(){
  kangaroo.velocityY = 0;
  jungle.velocityX = 0;
  kangaroo.visible = false;
  jungle.visible = false;
  restart.x = 440;
  restart.y = 300;
  restart.visible = true;
  Score.position(-100,-100);
  
  Win.html("You Win!") ;
  obstaclesGroup.setVelocityXEach(0);
  shrubsGroup.setVelocityXEach(0);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach()
}
function spawnShrubs() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.debug=true;
    shrub.velocityX = -(6 + 3*score/3)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.05;
     //assign lifetime to the variable
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    //add each cloud to the group
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/3)
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           
    obstacle.debug=true    
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}