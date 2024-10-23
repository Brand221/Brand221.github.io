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

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
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
        this.bullets[bulletCount] = new Bullet(this.x1, this.y2 - this.size, bullDamage);
        this.bullets[bulletCount].summon(10);
      //   console.log(bulletCount);
        bulletCount++;
      }
    }

    shotGun(){
      let shelldamage = 7;
      if(keyIsDown(32) && (whenShot <= now.getTime() - 600) && this.shot == false){
          whenShot = now.getTime();
          this.bullets[bulletCount] = new Bullet(this.x1, this.y2 - this.size, shelldamage)
          this.bullets[bulletCount + 1] = new Bullet(this.x1, this.y2 - this.size, shelldamage)
          this.bullets[bulletCount + 2] = new Bullet(this.x1, this.y2 - this.size, shelldamage)
          this.bullets[bulletCount + 3] = new Bullet(this.x1, this.y2 - this.size, shelldamage)
          this.bullets[bulletCount + 4] = new Bullet(this.x1, this.y2 - this.size, shelldamage)
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
      if(keyIsDown(32) && (whenShot <= now.getTime() - 2000) && this.shot == false){
        whenShot = now.getTime();
        rockets[rocketCount] = new Rocket(this.x1, this.y, rocketDamage)
      }
    }

    checkCollision(){
      for(let i = 0; i < enemies.length; i++){
          if(enemies[i].getX() >= this.x2 && enemies[i].getX() <= this.x1 && enemies[i].getY() >= this.y3 && enemies[i].getY() <= this.y2 && !enemies[i].getDead() && iFrames <= now.getTime() - 700){
            iFrames = now;
              this.hp -= 10
          }
      }
    }

    delClassBul(index){
      delete this.bullets[index];
      this.bullets.splice(index, 1);
    }

    getX(){
      return this.x;
    }

    getY(){
      return this.y;
    }

    getSize(){
      return this.size;
    }
    getBullets(){
      return this.bullets;
    }

    getHP(){
      return this.hp;
    }

    getMaxHP(){
      return this.maxHP;
    }
    deadChecker(){
      if(this.hp <= 0){
        this.hp = 0;
        this.dead = true;
      }
    }
    getDead(){
      return this.dead;
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
    for(const element of shipBullets){
        if(element.getX() >= this.x1 && element.getX() <= this.x2 && element.getY() >= this.y2 && element.getY() <= this.y1){
            this.hp -= element.getDamage();
            element.reachedTarget();
        }
    }
    for(let i in rockets){
      if(rockets[i].getX() + 10 >= this.x1 && rockets[i].getX() - 30 < this.x2 && rockets[i].getY() - 10 <= this.y1 && rockets[i].getY() + 10 >= this.y2){
        rockets[i].detonate();
        this.hp -= rockets[i].getDamage();
      }
    }
    for(let i in explosions){
      let distance = Math.sqrt(Math.pow(this.x - explosions[i].getX(), 2)+ Math.pow(this.y - explosions[i].getY(), 2))
      if(distance <= explosions[i].getRadius()){
        this.hp -= explosions[i].getDamage();
      }
    }
}
}
}
class Bullet{
constructor(x, y, damage){ 
  this.x = x;
  this.y = y;
  this.damage = damage;
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

getX(){
  return this.x;
}

getY(){
  return this.y;
}

getUsed(){
  return this.used;
}

getDamage(){
  return this.damage;
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
  getUsed(){
    return this.used;
  }
  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  getRadius(){
    return this.size / 2;
  }

  getDamage(){
    return this.damage;
  }
}
//alle variabelen declaren
const canvas = document.getElementById("canvaas");
const body = document.querySelector("body");
let canvasX = 600;
let canvasY = 400;
let size = 20;
let whenShot;
let now = new Date();
let iFrames;
let neverShot = true;
let neverShotGun = true;
let gunMode = 1;
let player;
let enemies = [];
let stars = [];
let shipBullets;
let bfgDivision;
let changing = false;
let enemyCooldown;
let rocketCount = 0;
let enemyCount = 0;
let bulletCount = 0;
let starCount = 0;
let explosionCount = 0;
let rockets = [];
let explosions = [];
let whendied;
let score;
let died = false;
let level = 0;
//bestanden laden
function preload(){
  soundFormats('mp3', 'ogg');
  bfgDivision = loadSound('mastermind.mp3');
}
//alles in de begin status zetten
function setup() {
    createCanvas(canvasX, canvasY, P2D,canvas);
    player = new Ship(100, 200, size, 50);
    enemyCooldown = now.getTime() - 10000;
    bfgDivision.amp(0.3);
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
    bfgDivision.loop();
  }
}

function controls(){
  let shipXSpeed = 7;
  let shipYSpeed = 7;
  if(!player.dead){
    changeGun();
    //voor beweging
    if (keyIsDown(68) && (player.getX() + player.getSize() <= canvasX )){
      player.moveHor(shipXSpeed);
    }
    if(keyIsDown(65) && (player.getX() - player.getSize() >= 0)){
      player.moveHor(-shipXSpeed);
    }
    if (keyIsDown(87) && (player.getY() - player.getSize() >= 0)){
      player.moveVer(-shipYSpeed);
    }
    if(keyIsDown(83) && (player.getY() + player.getSize() <= canvasY)){
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
  for(i in explosions){
    explosions[i].expand();
  }
}
  //de functie waar ik alles in zet om de game te laten werken
  function draw() {
    if(level == 0){
      start();
    }
    else{
      shipBullets = player.getBullets();
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
      // console.log(player.getX());
      shipBullets = player.getBullets();
      delBullets();
      shipBullets = player.getBullets();
      shoot();
      doTheExplodie();
      showExplosion();
      enemyColision();
      hud();
    }
  }
  //voor de geweren
  function shoot(){
    if (gunMode == 1 && !player.dead) {
      //om de kogels te maken
        player.gun();
        // om de kogels laten blijven bewegen
        for(let i in shipBullets){
            shipBullets[i].summon();
            shipBullets[i].move(30, 0);
        }
    }
    else if(gunMode == 2 && !player.dead){
        player.shotGun();
        shipBullets = player.getBullets();
        for(let i = 0; i < shipBullets.length; i++){
          // console.log("bullets when shotgun: " + shipBullets)
          if(shipBullets[i] != null){
            shipBullets[i].summon();
            shipBullets[i].move(30, 0);
          }
          if(shipBullets[i+1] != null){
            shipBullets[i + 1].summon();
            shipBullets[i + 1].move(10, 1);
          }
          if(shipBullets[i+2] !=null){
            shipBullets[i + 2].summon();
            shipBullets[i + 2].move(10, 2);
          }
          if(shipBullets[i+3] != null){
            shipBullets[i + 3].summon();
            shipBullets[i + 3].move(10, -1);
          }
          if(shipBullets[i+4] != null){
            shipBullets[i + 4].summon();
            shipBullets[i + 4].move(10, -2);
          }
        }
    }
    else if(gunMode == 3 && !player.dead){
      player.rocketLauncher();
      for(let i in rockets){
        if(rockets[i] != null){
          rockets[i].summon();
          rockets[i].move(10, 0);
        }
      }
    }
  }


// tekst op het scherm
function hud(){
  let scoreString = "Score:" + score;
  let hpString = "HP:";
  textSize(20);
  fill(255, 255, 255);
  noStroke();
  text(scoreString, 20, 20);
  textSize(20);
  fill(255, 255, 255);
  noStroke();
  text(hpString, canvasX - 100, 20);
  fill(255, 0, 0);
  noStroke();
  rect(canvasX - 60, 7, 50, 15);
  fill(0, 255, 0);
  noStroke();
  rect(canvasX - 60, 7, 50 * (player.getHP() / player.getMaxHP()), 15)
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
  if(enemyCooldown <= now.getTime() - 600){
    enemyCooldown = now.getTime();
    enemies[enemyCount] = new Enemy(canvasX + 50, place, 20, 10);
    enemyCount++;
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
}
function delEnemies(){
  for(let i = 0; i < enemies.length; i++){
    if(enemies[i].getX() < -10 || enemies[i].getDead()){
      delete enemies[i];
      enemies.splice(i, 1);
      enemyCount = enemies.length;
      // console.log("amount of enemies in array:" + enemies.length);
    }
  }
}


function delBullets(){
  for(let i = 0; i < shipBullets.length; i++){
    if(shipBullets[i].getX() > canvasX + 10 || shipBullets[i].getUsed()){
      delete shipBullets[i];
      shipBullets.splice(i, 1);
      player.delClassBul(i);
      bulletCount = shipBullets.length;
    }
  }
  for(let i = 0; i < rockets.length; i++){
    if(rockets[i].getX() > canvasX + 20 || rockets[i].getUsed()){
      delete rockets[i];
      rockets.splice(i, 1);
      rocketCount = rockets.length;
    }
  }
  for(let i in explosions){
    if(explosions[i].getUsed()){
      delete explosions[i];
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
}
// als hp kleiner is dan nul zal de vijanden dood gaan
function checkIfEnemyDead(){
  for(let i in enemies){
    enemies[i].checkIfDead();
    enemies[i].upScore();
  }
}
  function changeGun(){
    if(keyIsDown(49) && !changing){
        gunMode = 1;
        neverShotGun = true;
        changing = true;
    }
    else if(keyIsDown(50) && !changing){
      whenShot = now.getTime() - 1000;
        gunMode = 2;
        changing = true;
    }
    else if(keyIsDown(51) && !changing){
      whenShot = now.getTime() - 2000;
      gunMode = 3;
      changing = true;
    }
    //zodat de speler niet de knop ingedrukt kan houden
    else if(!keyIsDown(50) && !keyIsDown(49)){
      changing = false;
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
      if(stars[i].getX() < -10){
        delete stars[i];
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