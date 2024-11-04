//de objecten
class Star{
  constructor(x, y){
      this.x = x;
      this.y = y
  }

  drawStar(){
      stroke("white");
      strokeWeight(2)
      point(this.x, this.y);
  }

  move(x){
      this.x -= x;
  }
}
class Ship{
    constructor(x, y, size, hp){
        this.x = x;
        this.y = y;
        this.x1 = x + size;
        this.x2 = x - size;
        this.y1 = y;
        this.y2 = y + size;
        this.y3 = y - size;
        this.hp = hp;
        this.maxHP = hp;
        this.size = size;
        this.bullets = [];
        this.shot = false;
        this.dead = false;
    }
    moveHor(speed){
      this.x1 += speed;
      this.x2 += speed;
      this.x += speed;
    }
    moveVer(speed){
      this.y1 += speed;
      this.y2 += speed;
      this.y3 += speed;
      this.y += speed;
    }
    drawShip() {
      if(!this.dead){
        stroke(128, 128, 128);
        fill(128, 128, 128);
        triangle(this.x1, this.y1, this.x2, this.y2, this.x2, this.y3);
      }
    }

    gun(){
      let bullDamage = 5;
      if(keyIsDown(32) && (whenShot <= now.getTime() - 66)){
          whenShot = now.getTime();
        this.bullets[bulletCount] = new Bullet(this.x1, this.y2 - this.size, bullDamage, "MG");
        this.bullets[bulletCount].summon(10);
      //   console.log(bulletCount);
        bulletCount++;
      }
    }

    shotGun(){
      let shelldamage = 7;
      if(keyIsDown(32) && (whenShot <= now.getTime() - 600) && !this.shot){
          whenShot = now.getTime();
          this.bullets[bulletCount] = new Bullet(this.x1, this.y2 - this.size, shelldamage, "SH", 1)
          this.bullets[bulletCount + 1] = new Bullet(this.x1, this.y2 - this.size, shelldamage, "SH", 2)
          this.bullets[bulletCount + 2] = new Bullet(this.x1, this.y2 - this.size, shelldamage, "SH", 3)
          this.bullets[bulletCount + 3] = new Bullet(this.x1, this.y2 - this.size, shelldamage, "SH", 4)
          this.bullets[bulletCount + 4] = new Bullet(this.x1, this.y2 - this.size, shelldamage, "SH", 5)
          bulletCount += 5;
          neverShotGun = false;
          this.shot = true;
      }
      else if(!keyIsDown(32)){
        this.shot = false;
      }
    }
    rocketLauncher(){
      let rocketDamage = 20;
      if(keyIsDown(32) && (whenShot <= now.getTime() - 2000) && !this.shot){
        whenShot = now.getTime();
        rockets[rocketCount] = new Rocket(this.x1, this.y, rocketDamage)
      }
    }

    checkCollision(){
      for(const element of enemies){
          if(element.x >= this.x2 && element.x <= this.x1 && element.y >= this.y3 && element.y <= this.y2 && !element.dead && iFrames <= now.getTime() - 700){
            iFrames = now;
            this.hp -= 10
            element.hp = 0;
          }
      }
      for(const element of hunters){
        if(element.x >= this.x2 && element.x <= this.x1 && element.y >= this.y3 && element.y <= this.y2 && !element.dead && iFrames <= now.getTime() - 700){
          iFrames = now;
          this.hp -= 10
          element.hp -= 10;
        }

        for(const e of element.bullets){
          if(e.x <= this.x1 && e.x >= this.x2 && e.y >= this.y3 && e.y <= this.y2){
            this.hp -= e.damage;
            e.reachedTarget();
          }
        }
    }
    }
    deadChecker(){
      if(this.hp <= 0){
        this.hp = 0;
        this.dead = true;
      }
    }
    //iets om niet te veel ramgeheugen te leaken
    resetBullets(){
      this.bullets = [];
      bulletCount = 0;
    }
  
  }
class Enemy extends Ship{
constructor(x, y, size, hp){
  super(x, y, size, hp)
  this.x1 = this.x - this.size;
  this.x2 = this.x + this.size;
  this.y1 = this.y + this.size;
  this.y2 = this.y - this.size;
  this.increasedScore = false;
}

drawShip(){
  if(!this.dead){
    stroke(255, 0, 0)
    fill(255, 0, 0)
    triangle(this.x1, this.y, this.x2, this.y1, this.x2, this.y2);
  }
}

checkIfDead(){
  if(this.hp <= 0){
    this.dead = true;
  }
}

upScore(){
  if(!(this.increasedScore) && this.dead){
    score++
    this.increasedScore = true;
  }
}

checkCollision(){
  if(!this.dead){
    for(const element of player.bullets){
        if(element.x >= this.x1 && element.x <= this.x2 && element.y >= this.y2 && element.y <= this.y1){
            this.hp -= element.damage;
            element.reachedTarget();
        }
    }
    for(let i in rockets){
      if(rockets[i].x + 10 >= this.x1 && rockets[i].x - 30 < this.x2 && rockets[i].y - 10 <= this.y1 && rockets[i].y + 10 >= this.y2){
        rockets[i].detonate();
        this.hp -= rockets[i].damage;
      }
    }
    for(let i in explosions){
      let distance = Math.sqrt(Math.pow(this.x - explosions[i].x, 2)+ Math.pow(this.y - explosions[i].y, 2))
      if(distance <= explosions[i].getRadius()){
        this.hp -= explosions[i].damage;
      }
    }
}
}
}
class Hunter extends Enemy{

  constructor(x, y, size, hp){
    super(x, y, size, hp);
    this.shellcount = 0;
    this.lastShot = Date.now();
    this.lastMoved = 0;
    this.radDist = 20;
  }

  drawShip(){
    if(!this.dead){
      stroke(153, 0, 0)
      fill(153, 0, 0)
      triangle(this.x1, this.y, this.x2, this.y1, this.x2, this.y2);
    }
  }
  
  shotGun(){
    let shelldamage = 7;
    if(this.lastShot <= Date.now() - 1500){
        this.bullets[this.shellcount] = new Bullet(this.x1, this.y, shelldamage, "SH", 1)
        this.bullets[this.shellcount + 1] = new Bullet(this.x1, this.y, shelldamage, "SH", 2)
        this.bullets[this.shellcount + 2] = new Bullet(this.x1, this.y, shelldamage, "SH", 3)
        this.bullets[this.shellcount + 3] = new Bullet(this.x1, this.y, shelldamage, "SH", 4)
        this.bullets[this.shellcount + 4] = new Bullet(this.x1, this.y, shelldamage, "SH", 5)
        this.shellcount += 5;
        this.lastShot = Date.now();
    }
  }

  AI(){
    this.shotGun();
    if(this.lastMoved <= Date.now() - 1500){
      this.distanceX = player.x + 100 - this.x;
      this.distanceY = player.y - this.y;
      this.moveDistX = Math.abs(this.distanceX);
      this.moveDistY = Math.abs(this.distanceY);
      this.lastMoved = Date.now();
    }
    this.moveToPlayer();
  }

  moveToPlayer(){
    this.speedX = this.distanceX / 20;
    this.speedY = this.distanceY / 20;
    this.moveDistX -= Math.abs(this.speedX);
    this.moveDistY -= Math.abs(this.speedY);
    if(this.moveDistX >= 0){
      this.moveHor(this.speedX);
    }
    if(this.moveDistY >= 0){
      this.moveVer(this.speedY);
    }
  }
}
class Bullet{
constructor(x, y, damage, type, shellNumber){ 
  this.x = x;
  this.y = y;
  this.damage = damage;
  this.shellNumber = shellNumber;
  this.type = type;
  this.used = false;
}

summon(){
  if(!this.used){
    stroke("white");
    strokeWeight(3);
    line(this.x, this.y, this.x + 10, this.y);
  }
}

move(xSpeed, ySpeed){
  this.x += xSpeed;
  this.y += ySpeed;
}

reachedTarget(){
  this.used = true;
}
}
class Rocket extends Bullet{

summon(){
  if(!this.used){
    stroke("orange")
    fill("white")
    triangle(this.x - 10, this.y - 5, this.x-30, this.y - 15, this.x-30, this.y +5)
    triangle(this.x + 10, this.y - 5, this.x, this.y, this.x, this.y -10);
    rect(this.x - 20, this.y - 10, 20 ,10);
  }
}

detonate(){
  explosions[explosionCount] = new Explosion(this.x, this.y, 10, this.damage)
  explosionCount++;
  this.used = true;
}
}

class Explosion{
constructor(x, y , size, damage){
  this.x = x;
  this.y = y
  this.size = size
  this.damage = damage;
  this.used = false;
  this.timer = Date.now();
  this.start = false;
}

drawExplosion(){
  if(!this.used){
    noStroke();
    fill(255, 165, 0)
    circle(this.x, this.y, this.size)
  }
}

expand(){
  if(!this.start){
    this.timer = Date.now();
    this.start = true;
  }
  if(this.timer >= Date.now() - 1600){ this.size += 5}
  else{
    this.used = true;
  }
}

  getRadius(){
    return this.size / 2;
  }
}
//alle variabelen declaren
const canvas = document.getElementById("canvaas");
const body = document.querySelector("body");
let canvasX = 600;
let canvasY = 400;
let size = 20;
let whenShot;
let enemyBuffer = 600;
let levelTimer;
let now = new Date();
let iFrames;
let neverShot = true;
let neverShotGun = true;
let gunMode = 1;
let player = new Ship(100, 200, size, 50);
let enemies = [];
let hunters = [];
let stars = [];
let mastermind;
let bfgDivision;
let riptear;
let weaponChanging = false;
let levelChanger = false;
let enemyCooldown;
let rocketCount = 0;
let enemyCount = 0;
let hunterCount = 0;
let bulletCount = 0;
let starCount = 0;
let explosionCount = 0;
let levelHChance = 20
let rockets = [];
let explosions = [];
let whendied;
let score;
let died = false;
let level = 0;
//bestanden laden
function preload(){
  soundFormats('mp3', 'ogg');
  mastermind = loadSound('mastermind.mp3');
  bfgDivision = loadSound('bfgdivision.mp3');
  riptear = loadSound('RipTear.mp3');
}
//alles in de begin status zetten
function setup() {
    createCanvas(canvasX, canvasY, P2D,canvas);
    enemyCooldown = now.getTime() - 10000;
    mastermind.amp(0.3);
    bfgDivision.amp(0.3);
    riptear.amp(0.3);
    iFrames = now.getTime() - 700;
    score = 0;
  }
function youDead(){
  if(player.dead){
    if(!died){
      died = true;
      whendied = now.getTime();
    }
    textSize(30);
    fill(255);
    noStroke();
    text("You Died", canvasX/2 - 50, canvasY - 50);
    if(whendied <= now.getTime() - 3000) location.reload();
  }
}
//starscherm
function start(){
  background(0);
  textSize(30);
  fill(255, 255, 255);
  noStroke();
  text("it's just a ship", canvasX/2 - 100, canvasY/2)
  textSize(15);
  text("press enter", canvasX/2 - 50, canvasY - 50)
  // de game beginnen en muziek aanzetten
  if(keyIsDown(13)){
    level += 1;
    mastermind.loop();
  }
}

function Levelup(){
  if(score == 100 && !levelChanger && level == 1){
    mastermind.stop()
    level += 1
    player.hp = player.maxHP
    enemyBuffer = 400;
    levelTimer = now.getTime();
    levelChanger = true;
    enemies = [];
    hunters = [];
    enemyCount = enemies.length;
    hunterCount = hunters.length;
  }
  else if(score == 200 && !levelChanger && level == 2){
    bfgDivision.stop();
    level += 1;
    enemyBuffer = 200;
    player.hp = player.maxHP
    levelHChance = 15;
    levelTimer = now.getTime();
    levelChanger = true;
    enemies = [];
    hunters = [];
    enemyCount = enemies.length;
    hunterCount = hunters.length;
  }
  else if(score == 350 && !levelChanger && level == 3){
    riptear.pause();
    level = 4;
    enemyBuffer = 150;
    player.hp = player.maxHP
    levelHChance = 10;
    levelTimer = now.getTime();
    levelChanger = true;
    enemies = [];
    hunters = [];
    enemyCount = enemies.length;
    hunterCount = hunters.length;
  }
}

function changeLevel(){
  if(levelChanger && level == 2){
    if(levelTimer > now.getTime()- 3000){
      noStroke();
      fill(255)
      text("completed the first level", (canvasX/ 2)- 100, canvasY/2)
    }
    else if(levelTimer > now.getTime() - 6000){
      noStroke();
      fill(255)
      text("you unlocked the shotgun", (canvasX/ 2)- 100, canvasY/2)
    }
    else if(levelTimer > now.getTime() - 9000){
      noStroke();
      fill(255)
      text("now entering level 2", (canvasX/ 2)- 100, canvasY/2)
    }
    else{
      console.log("change levels")
      bfgDivision.loop()
      levelChanger = false;
    }
  }
  else if(levelChanger && level == 3){
    if(levelTimer > now.getTime()- 3000){
      noStroke();
      fill(255)
      text("completed the second level", (canvasX/ 2)- 100, canvasY/2)
    }
    else if(levelTimer > now.getTime() - 6000){
      noStroke();
      fill(255)
      text("you unlocked the rocket launcher", (canvasX/ 2)- 100, canvasY/2)
    }
    else if(levelTimer > now.getTime() - 9000){
      noStroke();
      fill(255)
      text("now entering level 3", (canvasX/ 2)- 100, canvasY/2)
    }
    else{
      console.log("change levels")
      riptear.loop()
      levelChanger = false;
    }
  }
  else if(levelChanger && level == 4){
    if(levelTimer > now.getTime()- 3000){
      noStroke();
      fill(255)
      text("completed the third level", (canvasX/ 2)- 100, canvasY/2)
    }
    else if(levelTimer > now.getTime() - 6000){
      noStroke();
      fill(255)
      text("now entering Endless Mode", (canvasX/ 2)- 100, canvasY/2)
    }
    else{
      console.log("change levels")
      riptear.loop()
      levelChanger = false;
    }
  }
}

function controls(){
  let shipXSpeed = 7;
  let shipYSpeed = 7;
  if(!player.dead){
    changeGun();
    //voor beweging
    if (keyIsDown(68) && (player.x + player.size <= canvasX )){
      player.moveHor(shipXSpeed);
    }
    if(keyIsDown(65) && (player.x - player.size >= 0)){
      player.moveHor(-shipXSpeed);
    }
    if (keyIsDown(87) && (player.y - player.size >= 0)){
      player.moveVer(-shipYSpeed);
    }
    if(keyIsDown(83) && (player.y + player.size <= canvasY)){
      player.moveVer(shipYSpeed);
    }
    //ervoor zorgen dat de speler kan schieten
    if (keyIsDown(32) && neverShot){
        whenShot = now.getTime() - 2000;
        neverShot = false;
    }
  }
}

function doTheExplodie(){
  for(let i in explosions){
    explosions[i].expand();
  }
}
  //de functie waar ik alles in zet om de game te laten werken
  function draw() {
    if(level == 0){
      start();
    }
    else{
      background(0);
      now = new Date();
      controls();
      space();
      drawSpace();
      delStars();
      player.drawShip();
      spawnEnemies();
      moveEnemies();
      player.checkCollision();
      player.deadChecker();
      youDead();
      checkIfEnemyDead();
      delEnemies();
      delBullets();
      shoot();
      moveBullets();
      moveRockets();
      doTheExplodie();
      showExplosion();
      enemyColision();
      Levelup();
      changeLevel();
      hud();
    }
  }
  //voor de geweren
  function shoot(){
    if (gunMode == 1 && !player.dead && !levelChanger) {
      //om de kogels te maken
        player.gun();
    }
    else if(gunMode == 2 && !player.dead && !levelChanger){
        player.shotGun();
    }
    else if(gunMode == 3 && !player.dead && !levelChanger){
      player.rocketLauncher();
    }
  }

function moveBullets(){
  for(let i of player.bullets){
    if(i.type == "MG"){
      i.summon();
      i.move(30, 0);
    }
    else if(i.type == "SH"){
      if(i.shellNumber == 1){
        i.summon();
        i.move(30, 0);
      }
      else if(i.shellNumber == 2){
        i.summon();
        i.move(30, 2);
      }
      else if(i.shellNumber == 3){
        i.summon();
        i.move(30, 4)
      }
      else if(i.shellNumber == 4){
        i.summon();
        i.move(30, -2)
      }
      else if(i.shellNumber == 5){
        i.summon();
        i.move(30, -4)
      }
    }
  }
  for(const el of hunters){
    for(const e of el.bullets){
      if(e.shellNumber == 1){
        e.summon();
        e.move(-30, 0);
      }
      else if(e.shellNumber == 2){
        e.summon();
        e.move(-30, 2);
      }
      else if(e.shellNumber == 3){
        e.summon();
        e.move(-30, 4)
      }
      else if(e.shellNumber == 4){
        e.summon();
        e.move(-30, -2)
      }
      else if(e.shellNumber == 5){
        e.summon();
        e.move(-30, -4)
      }
    }
  }
}

function moveRockets(){
  for(let i in rockets){
    if(rockets[i] != null){
      rockets[i].summon();
      rockets[i].move(10, 0);
    }
  }
}


// tekst op het scherm
function hud(){
  let levelString;
  let scoreString = "Score:" + score;
  let hpString = "HP:";
  if(level < 4){
  levelString = "Level:" + level
  }
  else{
    levelString = "Level:Endless"
  }
  textSize(20);
  fill(255, 255, 255);
  noStroke();
  text(scoreString, 20, 20);
  text(levelString, canvasX / 2 - 100, 20)
  textSize(20);
  fill(255, 255, 255);
  noStroke();
  text(hpString, canvasX - 100, 20);
  fill(255, 0, 0);
  noStroke();
  rect(canvasX - 60, 7, 50, 15);
  fill(0, 255, 0);
  noStroke();
  rect(canvasX - 60, 7, 50 * (player.hp / player.maxHP), 15)
  if(gunMode == 1){
    textSize(20);
    fill(255, 255, 255);
    noStroke();
    text("Heavy MG", 20, canvasY - 20);
  }
  else if(gunMode == 2){
    textSize(20);
    fill(255, 255, 255);
    noStroke();
    text("ShotGun", 20, canvasY - 20);
  }
  else if(gunMode == 3){
    textSize(20);
    fill(255, 255, 255);
    noStroke();
    text("Rocket Launcher", 20, canvasY - 20);
  }

}
// om vijanden te maken
function spawnEnemies(){
  let place = Math.floor(Math.random() * (canvasY - 1)) + 1
  let hunterChance = Math.floor(Math.random() * (levelHChance - 1)) + 1;
  if(enemyCooldown <= now.getTime() - enemyBuffer && !levelChanger && level == 1){
    enemyCooldown = now.getTime();
    enemies[enemyCount] = new Enemy(canvasX + 50, place, 20, 10);
    enemyCount++;
  }
  else if(enemyCooldown <= now.getTime() - enemyBuffer && !levelChanger && level > 1){
    if(hunterChance == 1){
      enemyCooldown = now.getTime();
      hunters[hunterCount] = new Hunter(canvasX + 50, place, 20, 30);
      hunterCount++;
    }
    else{
      enemyCooldown = now.getTime();
      enemies[enemyCount] = new Enemy(canvasX + 50, place, 20, 10);
      enemyCount++;
    }
  }
}
function showExplosion(){
  for(let i in explosions){
    explosions[i].drawExplosion();
  }
}
// om de vijanden te bewegen
function moveEnemies(){
  for(let i in enemies){
    enemies[i].drawShip();
    enemies[i].moveHor(-5);
  }
  for(let i of hunters){
    i.drawShip();
    i.AI();
  }
}
function delEnemies(){
  for(let i = 0; i < enemies.length; i++){
    if(enemies[i].x < -10 || enemies[i].dead){
      enemies.splice(i, 1);
      enemyCount = enemies.length;
      // console.log("amount of enemies in array:" + enemies.length);
    }
  }
  for(let i = 0; i < hunters.length; i++){
    if(hunters[i].dead){
      hunters.splice(i, 1);
      hunterCount = hunters.length;
    }
  }
}


function delBullets(){
  for(let i = 0; i < player.bullets.length; i++){
    if(player.bullets[i].x > canvasX + 10 || player.bullets[i].used){
      player.bullets.splice(i, 1);
      bulletCount = player.bullets.length;
    }
  }
  for(let i = 0; i < rockets.length; i++){
    if(rockets[i].x > canvasX + 20 || rockets[i].used){
      rockets.splice(i, 1);
      rocketCount = rockets.length;
    }
  }
  for(let i = 0; i < explosions.length; i++){
    if(explosions[i].used){
      explosions.splice(i, 1);
      explosionCount = explosions.length;
    }
  }
}
//of de vijanden zijn geraakt door kogels
function enemyColision(){
  for(let i in enemies){
    enemies[i].checkCollision();
  }
  for(let i of hunters){
    i.checkCollision();
  }
}
// als hp kleiner is dan nul zal de vijanden dood gaan
function checkIfEnemyDead(){
  for(let i in enemies){
    enemies[i].checkIfDead();
    enemies[i].upScore();
  }
  for(let i of hunters){
    i.checkIfDead();
    i.upScore();
  }
}
  function changeGun(){
    if(keyIsDown(49) && !weaponChanging){
        gunMode = 1;
        neverShotGun = true;
        weaponChanging = true;
    }
    else if(keyIsDown(50) && !weaponChanging && level > 1){
      whenShot = now.getTime() - 1000;
        gunMode = 2;
        weaponChanging = true;
    }
    else if(keyIsDown(51) && !weaponChanging && level > 2){
      whenShot = now.getTime() - 2000;
      gunMode = 3;
      weaponChanging = true;
    }
    //zodat de speler niet de knop ingedrukt kan houden
    else if(!keyIsDown(50) && !keyIsDown(49)){
      weaponChanging = false;
    }
  }
  
  // sterren maken
  function space(){
    let chance = Math.floor(Math.random() * (5 - 1)) + 1;
    let place = Math.floor(Math.random() * (canvasY - 1)) + 1
    if(chance == 3){
        stars[starCount] = new Star(canvasX, place);
        starCount++;
    }
    
  }

  function delStars(){
    for(let i = 0; i < stars.length; i++){
      if(stars[i].x < -10){
        stars.splice(i, 1);
        starCount = stars.length;
      }
    }
  }
  //sterren laten bewegen
function drawSpace(){
  for(let i in stars){
        stars[i].drawStar();
        stars[i].move(3);
    }
}