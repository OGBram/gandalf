window.addEventListener('load', function(){
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 608;
canvas.height = 1216;
const tileWidth = 32;
const tileHeight = 32;
const audio1 = new Audio(document.getElementById("audioMusic").src);
const audio2 = new Audio(document.getElementById("audioGold").src);
const audio3 = new Audio(document.getElementById("audioSpell").src);
audio1.autoplay = false;
audio2.autoplay = false;
audio3.autoplay = false;
audio1.volume = .2;
audio2.volume = .2;
audio3.volume = .5;

    class Player {
    constructor(game, health){
        this.game = game;
        this.speedModifier = 1;
        this.spriteWidth = 32;
        this.spriteHeight = 32; 
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = 100;
        this.y = 100;
        this.targetX = 85;
        this.targetY = 85;
        this.frameX = 0;
        this.frameY = 4;
        this.maxFrame = 0;
        this.image = document.getElementById("player");
        this.speed = 2.5;
        this.health = health;
        this.healthBarWidth = 30;
        this.healthBarHeight = 7;
        this.isHit = false;
        this.hitDelay = null; 
    }
    draw(context) {
        context.save();
        context.globalAlpha = 1.0;
        context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    
        const healthBarX = this.x + (this.width / 2) - (this.healthBarWidth / 2);
        const healthBarY = this.y - 8;
        
        if (this.health === 0){
            this.reset();
            game.reset();
        }else if (this.health > 0) {
            if (this.health > 50) {
                context.fillStyle = "green";
            } else if (this.health > 20) {
                context.fillStyle = "orange";
            } else {
                context.fillStyle = "red";
            }
    
            const currentHealthWidth = (this.health / 100) * this.healthBarWidth;
            
            context.fillRect(healthBarX, healthBarY, currentHealthWidth, this.healthBarHeight);
            context.strokeStyle = "black";
            context.strokeRect(healthBarX, healthBarY, this.healthBarWidth, this.healthBarHeight);
        }
        
        context.restore();
    }
    reset(){
        this.health = 100;
    }
    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
         
        if(this.targetX > this.x){
            this.frameX = 1;
         }else{
            this.frameX = 0;
         }
        
         if (distance > this.speed) {
            const angle = Math.atan2(dy, dx);
            const nextX = this.x + Math.cos(angle) * this.speed;
            const nextY = this.y + Math.sin(angle) * this.speed-.5;
    
            if (!this.isCollidingWithTile(nextX, nextY, 1)) {
                this.x = nextX;
                this.y = nextY;
            }
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
        }
        if (this.hitDelay > 0) {
            this.hitDelay -= 1000 / 3;
            if (this.hitDelay <= 0) {
                this.health-= 5;
                game.ui.health-= 5;
                this.isHit = false;
                this.hitDelay = 0;
            }
        }
    }
    isCollidingWithTile(x, y) {
        const tileXLeft = Math.floor(x / 32);
        const tileXRight = Math.floor((x + this.width) / 32);
        const tileYTop = Math.floor(y / 32);
        const tileYBottom = Math.floor((y + this.height) / 32);
    
        const topLeftCollision = this.game.map[tileYTop] && this.game.map[tileYTop][tileXLeft] === 1;
        const topRightCollision = this.game.map[tileYTop] && this.game.map[tileYTop][tileXRight] === 1;
        const bottomLeftCollision = this.game.map[tileYBottom] && this.game.map[tileYBottom][tileXLeft] === 1;
        const bottomRightCollision = this.game.map[tileYBottom] && this.game.map[tileYBottom][tileXRight] === 1;
    
        return topLeftCollision || topRightCollision || bottomLeftCollision || bottomRightCollision;
    }
    setTargetPosition(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    }
    class Spell {
        constructor(player, mouseX, mouseY){
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = player.x-15;
            this.y = player.y-15;
            this.dx = player.dx;
            this.dy = player.dy;
            this.frameX = 2;
            this.frameY = 2;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
            this.speed = 6;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const angle = Math.atan2(dy, dx);
            this.dx = Math.cos(angle) * this.speed;
            this.dy = Math.sin(angle) * this.speed;
                    
        }
        draw(context) {
            context.save()
            context.globalAlpha = 1;
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height,
            );
            context.restore();
        }
        update(){
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    class Bomb  {
        constructor(player, mouseX, mouseY){
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 64; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = player.x-15;
            this.y = player.y-15;
            this.dx = player.dx;
            this.dy = player.dy;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 12;
            this.image = document.getElementById("bomb");
            this.speed = 3.5;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const angle = Math.atan2(dy, dx);
            this.dx = Math.cos(angle) * this.speed;
            this.dy = Math.sin(angle) * this.speed;
            this.spriteTimer = 0;        
        }
        draw(context) {
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height,
            );
        }
        update(){
            this.spriteTimer++;
            if(this.spriteTimer === 8){
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
                this.spriteTimer = 0;
            }     
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    class Lightning {
        constructor(player, npc3) {
            this.player = player;
            this.npc3 = npc3;
            this.speed = 5;
            this.spriteWidth = 64;
            this.spriteHeight = 64;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 3;
            this.image = document.getElementById("lightning");
            const dx = this.player.x - this.npc3.x;
            const dy = this.player.y - this.npc3.y;
            const angle = Math.atan2(dy, dx);
            this.x = this.npc3.x-100;
            this.y = this.npc3.y;
            this.dx = Math.cos(angle) * this.speed;
            this.dy = Math.sin(angle) * this.speed;
            this.spriteTimer = 0;
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width*2,
                this.height*2,
            );
        }
        update() {
            this.spriteTimer++;
            if (this.spriteTimer === 10) {
                this.frameX < this.maxFrame ? this.frameX++ : (this.frameX = 0);
                this.spriteTimer = 0;
            }
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    class Effects  {
        constructor(ui, player){
            this.player = player;
            this.ui = ui;   
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = this.ui.x+5;
            this.y = this.ui.y+5;
            this.frameX = 4;
            this.frameY = 14;
            this.maxFrame = 0;
            this.image = document.getElementById("player"); 
            this.spriteTimer = 0;          
        }
        draw(context) {
            const x = this.ui.x-20;
            const y = this.ui.y-100;

            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            x,
            y,
            this.width*1.25,
            this.height*1.25,
            );
        }
        update(){
            this.spriteTimer++;
            if(this.spriteTimer === 100){
                this.frameX = 14;
                this.spriteTimer = 0;
            }
            if(game.player.isHit === true){
                this.frameY = 4;
                this.frameX = Math.floor(Math.random()*3+5)
            }
        }
    }
    class Npc {
        constructor() {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random()*500+100;
            this.y = 1216;
            this.targetX = 0;
            this.targetY = 0;
            this.frameX = 0;
            this.frameY = 3;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
            this.speed = 2;
            this.isHit = false;
            this.spriteTimer = 0;
            this.enemyTimer = 0;
        }
        draw(context) {
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
            );
        }
        update(){
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance > this.speed) {
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
            if(this.isHit === true){
                this.frameX = 0;
                this.frameY = 1;
                this.maxFrame = 3;
                this.isHit = false; 
            }
        }
    }
    class Npc2 {
        constructor() {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random()*500+100;
            this.y = 1216;
            this.targetX = 500;
            this.targetY = 0;
            this.frameX = 3;
            this.frameY = 3;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
            this.speed = 3;
            this.isHit = false;
            this.spriteTimer = 0;
            this.enemyTimer = 0;

        }
        draw(context) {
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width*1.5,
            this.height*1.5
            );
        }
        update(){
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance > this.speed) {
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
            if(this.isHit === true){
                this.frameX = 0;
                this.frameY = 1;
                this.maxFrame = 3;
                this.isHit = false; 
            }
        }
    }
    class Npc3 {
        constructor() {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random()*500+100;
            this.y = 1216;
            this.targetX = 500;
            this.targetY = 0;
            this.frameX = 8;
            this.frameY = 3;
            this.maxFrame = 8;
            this.image = document.getElementById("project");
            this.speed = 2;
            this.isHit = false;
            this.spriteTimer = 0;
            this.enemyTimer = 0;

        }
        draw(context) {
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x+Math.random()*10-5,
            this.y,
            this.width*4,
            this.height*4,
            );
        }
        update(){
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance > this.speed) {
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
            if(this.isHit === true){
                this.frameX = 0;
                this.frameY = 1;
                this.maxFrame = 3;
                this.isHit = false; 
            }
        }
    }
    class Npcspell {
        constructor(player, npc2, x, y) {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.npc2 = npc2;
            this.x = npc2.x + Math.random()*10;
            this.y = npc2.y + Math.random()*100;
            this.frameX = 13;
            this.frameY = 2;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
            this.speed = Math.random()*3+2;
            this.player = player;
            const dx = this.player.x - this.x;
            const dy = this.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.dx = (dx / distance) * this.speed; 
            this.dy = (dy / distance) * this.speed; 
        }
        
        draw(context) {
            context.save();
            context.globalAlpha = Math.random()+.3;
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
            context.restore();
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    class Tressure {
        constructor(player, x, y, tressurePool) {
            this.player = player;
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 7;
            this.image = document.getElementById("coin");
            this.tressurePool = tressurePool;
            this.spriteTimer = 0;
        }
        draw(context) {
            context.save();
            context.globalAlpha = 1;
            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height,
            );
            context.restore();
        }
        update() {
            this.spriteTimer++;
            if(this.spriteTimer === 3){
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
                this.spriteTimer = 0;
            }     
        }
    }
    class Fruit {
        constructor(player, fruitPool) {
            this.player = player;
            this.speedModifier = 1;
            this.spriteWidth = 31;
            this.spriteHeight = 30; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.floor(Math.random()*400);
            this.y = 200+Math.random()*500;
            this.frameX = Math.floor(Math.random()*3);
            this.frameY = 2+Math.floor(Math.random()*3);
            this.maxFrame = 0;
            this.image = document.getElementById("fruit");
            this.fruitPool = fruitPool;
        }
        draw(context) {
            context.save();
            context.globalAlpha = 1;
            const sinOffset = Math.sin(Date.now() * 0.003) * 4;
            const newY = this.y + sinOffset;

            context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            newY,
            this.width*1.5,
            this.height*1.5,
            );
            context.restore();
        }
        update() {

            if (this.player.x < this.x + this.width &&
                this.player.x + this.player.width > this.x &&
                this.player.y < this.y + this.height &&
                this.player.y + this.player.height > this.y) {

                const index = this.fruitPool.indexOf(this);
                if (index !== -1) {
                    this.fruitPool.splice(index, 1);
                    this.player.health = 100;
                    game.ui.health = 100;
                    
                    this.fruitPool.push(new Fruit(this.player, this.fruitPool));

                }
            }
        }
    }
    class UI {
        constructor(player){
            this.player = player;
            this.health = 100;
            this.speedModifier = 1;
            this.spriteWidth = 324;
            this.spriteHeight = 74; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = player.x - 25;
            this.y = player.y - 25;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 0;
            this.image = document.getElementById("playerFrame");
            this.healthBarWidth = 130;
            this.healthBarHeight = 23;
        }
        draw(context) {
            context.save();
            context.globalAlpha = 1;
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                this.player.x - 32,
                this.player.y - 100,
                this.width * .75,
                this.height * .75,
            );
            context.restore();
            context.save();
            context.globalAlpha = 1;
            const healthBarX = this.player.x - 105 + (this.width / 1.666) - (this.healthBarWidth / 2);
            const healthBarY = this.player.y - 86;
            
            if (this.health === 0){
                this.reset();
            }else if (this.health > 0) {
                if (this.health > 50) {
                    context.fillStyle = "green";
                } else if (this.health > 20) {
                    context.fillStyle = "orange";
                } else {
                    context.fillStyle = "red";
                }
        
                const currentHealthWidth = (this.health / 100) * this.healthBarWidth;
                
                context.fillRect(healthBarX, healthBarY, currentHealthWidth, this.healthBarHeight);
                context.strokeStyle = "black";
                context.strokeRect(healthBarX, healthBarY, this.healthBarWidth, this.healthBarHeight);
                context.restore();
                context.save();
                context.globalAlpha = 1;
                ctx.fillStyle = "white";
                ctx.fillText(`Health:${this.health}`, healthBarX+5, healthBarY+20);
            }
            context.restore();
        }
        reset() {
            this.health = 100;
        } 
    }
    class Score {
        constructor(tressurePool) {
            this.tressurePool = tressurePool;
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 48;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 438;
            this.y = 56;
            this.frameX = 0;
            this.frameY = 1;
            this.maxFrame = 0;
            this.image = document.getElementById("numberSheet")
            this.counter = 0;
        }
        
        draw(context) {
            context.save();
            context.globalAlpha = 1;
            this.color = Math.floor(Math.random()*5) * this.spriteHeight;
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.color,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width*2,
                this.height*2
            );
            context.restore();
        }
        update() {
            if(game.tressurePool.length === 0){
                this.frameX = 0;
                this.frameY = 0;
            }
            if(game.tressurePool.length > 0){
                this.frameX = 1;
                this.frameY = Math.floor(Math.random()*5);
            }
            if(game.tressurePool.length > 1){
                this.frameX = 2;
            }
            if(game.tressurePool.length > 2){
                this.frameX = 3;
            }
            if(game.tressurePool.length > 3){
                this.frameX = 4;
            }
            if(game.tressurePool.length > 4){
                this.frameX = 5;
            }
            if(game.tressurePool.length > 5){
                this.frameX = 6;
            }
            if(game.tressurePool.length > 6){
                this.frameX = 7;    
            }
            if(game.tressurePool.length > 7){
                this.frameX = 8;
            }
            if(game.tressurePool.length > 8){
                this.frameX = 9;
            }
            if(game.tressurePool.length > 9){
                game.tressurePool = [];
                this.frameX = 0;
                this.counter++
                game.scoreTens.frameX = this.counter;
            }
        }
    }
    class ScoreTens {
        constructor() {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 48;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 438;
            this.y = 56;
            this.frameX = 50;
            this.frameY = 1;
            this.maxFrame = 0;
            this.image = document.getElementById("numberSheet")
        }
        
        draw(context) {
            context.save();
            context.globalAlpha = 1;
            context.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                game.score.color,
                this.spriteWidth,
                this.spriteHeight,
                this.x-55,
                this.y,
                this.width*2,
                this.height*2
            );
            context.restore();
        }
    }
    class Game {
        constructor() {
            this.canvas = document.getElementById("myCanvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = 608;
            this.canvas.height = 1216;
            this.audio1 = audio1;
            this.audio2 = audio2;
            this.audio3 = audio3;
            this.health = 100;
            this.player = new Player(this, this.health);
            this.spells = [];
            this.npcPool = [];
            this.npcSpellPool = [];
            this.tressurePool = [];
            this.fruitPool = [];
            this.bombPool = [];
            this.npc3Pool = [];
            this.png = document.getElementById("project");
            this.frameX = 0;
            this.frameY = 0;
            const tileWidth = 32;
            const tileHeight = 32;
            this.background = document.getElementById('bgTwo');
            this.npc = new Npc(this);
            this.npc2 = new Npc2(this);
            this.npc3 = new Npc3(this);
            this.bomb = new Bomb(this);
            this.score = new Score(this, this.tressurePool);
            this.scoreTens = new ScoreTens();
            this.fruitPool.push(new Fruit(this.player, this.fruitPool));
            this.lightning = new Lightning(this.player, this.npc3);
            this.ui = new UI(this.player);
            this.effects = new Effects(this.player, this.ui);
            this.npcSpellPool.push(new Npcspell(this.player, this.npc2.x, this.npc2.y));
            this.startTimedEvent();
            this.map = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            
            const handleMouseDown = (event) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const mouseY = event.clientY - rect.top;
                    this.player.setTargetPosition(mouseX, mouseY);
                    this.spells.push(new Spell(this.player, mouseX, mouseY));
                    this.bombPool.push(new Bomb(this.player, mouseX, mouseY));
                    this.audio1.play();
                    this.audio3.play();
            }
            const handleTouchStart = (event) => {
                event.preventDefault();
                const rect = game.canvas.getBoundingClientRect();
                const touchX = event.touches[0].clientX - rect.left;
                const touchY = event.touches[0].clientY - rect.top;
                game.player.setTargetPosition(touchX, touchY);
                game.spells.push(new Spell(game.player, touchX, touchY));
                game.bombPool.push(new Bomb(game.player, touchX, touchY));
                game.audio1.play();
                game.audio3.play();         
            }
        
            this.canvas.addEventListener('mousedown', handleMouseDown);
            this.canvas.addEventListener('touchstart', handleTouchStart);
        }
        changeMapTiles(player) {
            const tileHeight = 32;
            const canvasHeight = 1216;
            this.player = player; 
        
            for (let y = 0; y < this.map.length; y++) {
                for (let x = 0; x < this.map[y].length; x++) {
                    // Calculate the actual pixel position of the tile's top
                    const tileYPosition = y * tileHeight;
                    const tileXPosition = x * tileHeight;

                    const trueDistance = this.player.y > tileYPosition-this.player.y;
                    if (trueDistance) {
                        this.map[y][x] = 1;
                    } 
                    if(!trueDistance) {
                        this.map[y][x] = 1;
                    }
                    if (this.player.y+400 > tileYPosition){
                        this.map[y][x] = 2;
                    };
                }
            }
        }
        
        startTimedEvent() {
            
            setInterval(() => {
                this.npcPool.push(new Npc());
            }, 2000);
            
            setInterval(() => {
                this.npcPool.push(new Npc2());
            },3000);
            
            setInterval(() => {
                this.npc3Pool.push(new Npc3());
            },5000);

            setInterval(() => {
                this.npc3Pool.forEach(npc3 => {
                    this.npcSpellPool.push(new Lightning(game.player, npc3));
                })
            },2000);
            
            setInterval(() => {
                this.npcPool.forEach((npc2) => {
                    for (let x = 0; x < 1; x++) {
                        this.npcSpellPool.push(new Npcspell(game.player, npc2));
                    }
                    
                })
            }, 2000);    
        }
    
        drawMap() {
            for (let y = 0; y < this.map.length; y++) {
                for (let x = 0; x < this.map[y].length; x++) {
                    let tile = this.map[y][x];
                    let xPos = x * tileWidth;
                    let yPos = y * tileHeight;
                    
                    if (tile === 1) {
                        ctx.globalAlpha = .9;
                        this.drawTile(xPos, yPos, "black");
                    }
                    if (tile === 2) {
                        ctx.globalAlpha = 0;
                        this.drawTile(xPos, yPos, "black");
                     }
                    //  if (tile === 3) {
                    //     // Draw PNG image
                    //     this.frameX = 0;
                    //     this.frameY = 0; 
                    //     this.ctx.drawImage(
                    //         this.png,
                    //         this.frameX * tileWidth,
                    //         this.frameY * tileHeight,
                    //         tileWidth,
                    //         tileHeight,
                    //         xPos,
                    //         yPos,
                    //         tileWidth,
                    //         tileHeight
                    //     );   
                }
            }
        }
        
        play() {
            if (!this.audioPlaying) {
                this.audio1.play();
                this.audioPlaying = true;
                
                this.game.audio1.addEventListener('ended', () => {
                    this.audioPlaying = false;
                });
            }
        }
        drawBackground() {
            this.ctx.drawImage(
                this.background,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
            );
        }

        drawTile(x, y, color) {

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, tileWidth, tileHeight);
        }
        
        reset() {
            this.effects.frameX = 50;
            this.tressurePool.length = 0;
            this.score.length = 0
            this.scoreTens.frameX = 50;
            this.npcSpellPool.length = 0;
            this.npc3Pool.length = 0;
            this.fruitPool.length = 0;
            this.fruitPool.push(new Fruit(this.player, this.fruitPool));
            this.health = 100;
            this.npcPool = [];
            this.spells = [];
            this.player.x = 200;
            this.player.y = 150;
        }
        update() {
            this.player.update();
            this.effects.update();
            if (this.health <= 0) {
                this.reset();
            }
            this.npc3Pool.forEach((npc3) => {
                npc3.update(this.npc3Pool, this);

                if (npc3.x === npc3.targetX && npc3.y === npc3.targetY) {
                    this.npc3Pool.splice(this, 1);
                    game.player.health -= 5;
                    game.ui.health -= 5;
                    this.health -= 5;

                }
            });
            this.npc3Pool.forEach((npc3) => {
                if (npc3.hitDelay > 0) {
                    npc3.hitDelay -= 1000 / 5;
                    if (npc3.hitDelay <= 0) {
                        this.npc3Pool.splice(this, 1);
                        
                        if(Math.random()*10>7){
                        this.tressurePool.push(new Tressure(this.player, npc3.x, npc3.y, this.tressurePool,));
                        this.audio2.play();
                }}}
            });

            this.npcPool.forEach((npc, npcIndex) => {
                npc.update(this.spells, this);

                if (npc.x === npc.targetX && npc.y === npc.targetY) {
                    this.npcPool.splice(npcIndex, 1);
                    game.player.health -= 5;
                    game.ui.health -= 5;
                    this.health -= 5;

                }
            });
            this.npcPool.forEach((npc, npcIndex) => {
                if (npc.hitDelay > 0) {
                    npc.hitDelay -= 1000 / 5;
                    if (npc.hitDelay <= 0) {
                        this.npcPool.splice(npcIndex, 1);
                        this.tressurePool.push(new Tressure(this.player, npc.x, npc.y, this.tressurePool,));
                        this.audio2.play();
                }}
            });
            
            this.tressurePool.forEach((tressure) => {
                tressure.update();
                if(this.tressurePool.length>3){
                    tressure.x -= Math.random()*10+4;
                    tressure.y -= Math.random()*10+5;
                }
            })
            this.bombPool.forEach((bomb) => {
                bomb.update();
                if(bomb.frameX ===11){
                    this.bombPool.splice(this, 1);
                }
                this.npcPool.forEach((npc, npcIndex) => {
                    if (bomb.x < npc.x + npc.width &&
                        bomb.x + bomb.width > npc.x &&
                        bomb.y < npc.y + npc.height &&
                        bomb.y + bomb.height > npc.y) {
                        npc.hitDelay = 1000;
                        npc.isHit = true;
                        npc.maxFrame = 3;
                    }
                });
                this.npc3Pool.forEach((npc3) => {
                    if (bomb.x < npc3.x + npc3.width &&
                        bomb.x + bomb.width > npc3.x &&
                        bomb.y < npc3.y + npc3.height &&
                        bomb.y + bomb.height > npc3.y) {
                        npc3.hitDelay = 1000;
                        npc3.isHit = true;
                        npc3.maxFrame = 3;
                    }
                });
            })
            this.spells.forEach((spell, spellIndex) => {
                spell.update();
                this.npcPool.forEach((npc) => {
                    if (spell.x < npc.x + npc.width &&
                        spell.x + spell.width > npc.x &&
                        spell.y < npc.y + npc.height &&
                        spell.y + spell.height > npc.y) {
                        npc.hitDelay = 1000;
                        npc.isHit = true;
                        npc.maxFrame = 3;
                    }
                });
                this.npc3Pool.forEach((npc3) => {
                    if (spell.x < npc3.x + npc3.width &&
                        spell.x + spell.width > npc3.x &&
                        spell.y < npc3.y + npc3.height &&
                        spell.y + spell.height > npc3.y) {
                        npc3.hitDelay = 1000;
                        npc3.isHit = true;
                        npc3.maxFrame = 3;
                    }
                });
                if (spell.x < 0 || spell.y < 0 || spell.x > canvas.width || spell.y > canvas.height) {
                    this.spells.splice(spellIndex, 1);
                }
            });
            this.npcSpellPool.forEach((spell) => {
                spell.update();
            });
            this.npcSpellPool.forEach((lightning) => {
                lightning.update();
            });
            this.npcSpellPool.forEach((spell) => {
                if (spell.x < this.player.x + this.player.width &&
                spell.x + spell.width > this.player.x &&
                spell.y < this.player.y + this.player.height &&
                spell.y + spell.height > this.player.y) {
                    this.player.isHit = true;
                    this.player.hitDelay = 1000;
                    this.npcSpellPool.splice(this, 1);
                }    
            });
            this.npcSpellPool.forEach((lightning) => {
                if (lightning.x < this.player.x + this.player.width &&
                lightning.x + lightning.width > this.player.x &&
                lightning.y < this.player.y + this.player.height &&
                lightning.y + lightning.height > this.player.y) {
                    this.player.isHit = true;
                    this.player.hitDelay = 1000;
                    this.npcSpellPool.splice(this, 1);
                }    
            });
            game.changeMapTiles(this.player,canvas); 

        }
        draw(ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBackground();
            this.player.draw(ctx);
            this.npcSpellPool.forEach((spell) => {
                spell.draw(this.ctx);
            });
            this.fruitPool.forEach((fruit) => {
                fruit.draw(ctx);
                fruit.update();
            });
            this.tressurePool.forEach((tressure) => {
                tressure.draw(ctx);
            });
            this.bombPool.forEach((bomb) => {
                bomb.draw(ctx);
            })    
            this.npcPool.forEach((npc) => {
                npc.draw(ctx);
            });
            this.npc3Pool.forEach((npc3) => {
                npc3.draw(ctx);
            });
            this.spells.forEach(spell => {
                spell.draw(ctx);
            });
            this.npcSpellPool.forEach(lightning => {
                lightning.draw(ctx);
            });

            ctx.fillStyle = "white";
            ctx.font = "20px monospace"
            this.ui.draw(ctx);
            this.effects.draw(ctx);
            ctx.fillText("Score:", 420, 56)
            ctx.fillStyle = "red";
            ctx.fillText("alpha in development", 200, 200)
            this.score.draw(ctx);
            this.score.update();
            this.scoreTens.draw(ctx);
            //this.drawMap();

        }
    }
    const game = new Game();

    var lastTime;
    var requiredElapsed = 1000 / 50; 

    requestAnimationFrame(loop);

    function loop(now) {
        requestAnimationFrame(loop);

        if (!lastTime) { lastTime = now; }
        var elapsed = now - lastTime;

        if (elapsed > requiredElapsed) {
            game.update();
            game.draw(ctx);
            lastTime = now;
        }
    }
});
