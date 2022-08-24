var PLAY = 1
var END = 1
var gameState = PLAY

var shin,shin_running,shin_collided
var ground, invisibleGround, groundImage

var cloudsGroup,cloudImage
var coronasGroup,corona1,corona2
var backgroundImg
var score=0
var jumpSound,collidedSound

var gameOver, restart


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")

  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation  = loadImage("sun.png")

  shin_running = loadAnimation("shin.png")
  shin_collided = loadAnimation("shin_collided.png")
   
  groundImage = loadImage("ground.png")

  cloudImage = loadImage("cloud.png")

  corona1 = loadImage("corona1.png")
  corona2 = loadImage("corona2.png")

  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup(){
  createCanvas(windowWidth,windowHeight)

  sun = createSprite(width-50,100,10,10)
  sun.addAnimation("sun",sunAnimation)
  sun.scale = 0.1

  shin = createSprite(50,height-70,20,50)


  shin.addAnimation("running",shin_running)
  shin.addAnimation("collided",shin_collided)
  shin.setCollider('circle',0,0,350)
  shin.scale = 0.80
  //shin.debug=true

  invisibleGround = createSprite(width/2,height-10,width,125)
  invisibleGround.shapeColor = "#f4cbaa"

  ground = createSprite(width/2,height,width,2)
  ground.addImage("ground",groundImage)
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100)

  gameOver = createSprite(width/2,height/2- 50)
  gameOver.addImage(gameOverImg)

  restart = createSprite(width/2,height/2)
  restart.addImage(restartImg)

  gameOver.scale=0.5
  restart.scale =0.1

  gameOver.visible = false
  restart.visible = false
   

  //invisibleGround.visible=false

  cloudsGroup = new Group()
  coronasGroup = new Group()

  score = 0
}

function draw (){

  background(backgroundImg)
  textSize(20)
  fill("black")
  text("Score: "+ score,30,50)


  if(gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if((touches.length > 0 || keyDown("SPACE")) && shin.y  >= height-120) {
      jumpSound.play( )
      shin.velocityY = -10;
       touches = [];
    }
    shin.velocityY = shin.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    shin.collide(invisibleGround);
    spawnClouds();
    spawnCoronas();
  
    if(coronasGroup.isTouching(shin)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if(gameState === END){
    gameOver.visible = true
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    shin.velocityY = 0;
    coronasGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the shin animation
    shin.changeAnimation("collided",shin_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    coronasGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }






  drawSprites()
}

function spawnClouds(){

  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = shin.depth;
    shin.depth = shin.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnCoronas() {
  if(frameCount % 60 === 0) {
    var corona = createSprite(600,height-95,20,30);
    corona.setCollider('circle',0,0,45)
    // corona.debug = true
  
    corona.velocityX = -(6 + 3*score/100);
    
    //generate random coronas
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: corona.addImage(corona1);
              break;
      case 2: corona.addImage(corona2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the corona          
    corona.scale = 0.3;
    corona.lifetime = 300;
    corona.depth = shin.depth;
    shin.depth +=1;
    //add each obstacle to the group
    coronasGroup.add(corona);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  coronasGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  shin.changeAnimation("running",shin_running);
  
  score = 0;
  
}
