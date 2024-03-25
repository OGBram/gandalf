window.addEventListener('load', function(){
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 608;
canvas.height = 608;
const tileWidth = 32;
const tileHeight = 32;
const audio1 = new Audio('/audio/Spell_02.wav');
const audio2 = new Audio('/audio/Pickup_Gold_04.wav');
const audio3 = new Audio('/audio/chiploop.mp3');
audio1.autoplay = false;
audio2.autoplay = false;
audio3.autoplay = false;
audio1.volume = 1;
audio1.playbackRate = 1;
audio3.volume = .5;
setTimeout(function() {
    const photoImg = document.querySelector("#photo img");
    const photoText = document.querySelector("#photo p");
    const myCanvas = document.getElementById("myCanvas");
    photoImg.style.opacity = 0;
    photoText.style.opacity = 0;
    myCanvas.style.opacity = 1.0;
}, 5000);

    class Player {
    constructor(game, health){
        this.game = game;
        this.speedModifier = 1;
        this.spriteWidth = 32;
        this.spriteHeight = 32; 
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = 200;
        this.y = 150;
        this.targetX = 150;
        this.targetY = 150;
        this.frameX = 0;
        this.frameY = 5;
        this.maxFrame = 0;
        this.image = document.getElementById("project");
        this.speed = 2;
        this.health = health;
        this.healthBarWidth = 30;
        this.healthBarHeight = 5; 
        this.healthBarColor = "green"; 
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
    
        if (this.health > 0) {
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
    
    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
         if(this.targetX > this.x){
            this.frameX = 7;
         }else{
            this.frameX = 0;
         }
        
         if (distance > this.speed) {
            const angle = Math.atan2(dy, dx);
            const nextX = this.x + Math.cos(angle) * this.speed;
            const nextY = this.y + Math.sin(angle) * this.speed;
    
            if (!this.isCollidingWithTile(nextX, nextY, 1)) {
                this.x = nextX;
                this.y = nextY;
            }
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    isCollidingWithTile(x, y) {
        const tileXLeft = Math.floor(x / 32);
        const tileXRight = Math.floor((x + this.width) / 32);
        const tileYTop = Math.floor(y / 32);
        const tileYBottom = Math.floor((y + this.height) / 32);
    
        // Check collision with all corners of the player rectangle
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
            this.speed = 4;
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
            this.speed = 2;
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
    class Npc {
        constructor() {
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = Math.random()*500+100;
            this.y = 625;
            this.targetX = 0;
            this.targetY = 0;
            this.frameX = 0;
            this.frameY = 3;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
            this.speed = 1;
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
            this.height,
            );
        }
        update(){
            if(!this.maxFrame===0){
            
            this.spriteTimer++;
            if(this.spriteTimer === 8){
            this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
            this.spriteTimer = 0;
            }     
        }
    
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
    class Tressure {
        constructor(player,x, y) {
            this.player = player;
            this.speedModifier = 1;
            this.spriteWidth = 32;
            this.spriteHeight = 32; 
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x;
            this.y = y;
            this.frameX = 10;
            this.frameY = 0;
            this.maxFrame = 0;
            this.image = document.getElementById("project");
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
        update(){
            if(this.player.x && this.player.y === this.x && this.y){
                this.tressurePool.splice(npcIndex, 1);
            }
        }
        
    }
    class Game {
        constructor() {
            this.canvas = document.getElementById("myCanvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = 608;
            this.canvas.height = 608;
            this.audio1 = audio1;
            this.audio2 = audio2;
            this.audio3 = audio3;
            this.health = 100;
            this.player = new Player(this, this.health); 
            this.spells = [];
            this.npcPool = [];
            this.tressurePool = [];
            this.bombPool = [];
            this.png = document.getElementById("project");
            this.frameX = 0;
            this.frameY = 0;
            const tileWidth = 32;
            const tileHeight = 32;
            this.background = document.getElementById("map1");
            this.npc = new Npc(this);
            this.bomb = new Bomb (this);
            this.startTimedEvent();
            
            this.map = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
                [1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ];
        
            this.canvas.addEventListener('click', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                if(mouseY > 300){
                    this.spells.push(new Spell(this.player, mouseX, mouseY));
                }else{
                    this.bombPool.push(new Bomb(this.player, mouseX, mouseY));
                }
                this.audio1.play();
                this.audio3.play();
                this.player.setTargetPosition(mouseX, mouseY);
            });
        }
        startTimedEvent() {
            setInterval(() => {
            this.npcPool.push(new Npc());
            }, 500);
    
        //     setInterval(() => {
        //     this.changeMapTiles();
        //     }, 35000);    
        }
        drawMap() {
            for (let y = 0; y < this.map.length; y++) {
                for (let x = 0; x < this.map[y].length; x++) {
                    let tile = this.map[y][x];
                    let xPos = x * tileWidth;
                    let yPos = y * tileHeight;
                    
                    if (tile === 1) {
                        this.drawTile(xPos, yPos, "rgb(50 150 50 / 50%)");//green

                    } else if (tile === 2) {
                        // Draw PNG image
                        this.frameX = 0;
                        this.frameY = 0; 
                        this.ctx.drawImage(
                            this.png,
                            this.frameX * tileWidth,
                            this.frameY * tileHeight,
                            tileWidth,
                            tileHeight,
                            xPos,
                            yPos,
                            tileWidth,
                            tileHeight
                        );
                    } // No condition for tile === 0, skipping drawing
                }
            }
        }
        changeMapTiles() {
            for (let y = 0; y < this.map.length; y++) {
                for (let x = 0; x < this.map[y].length; x++) {
                    if (this.map[y][x] === 1) {
                        this.map[y][x] = 0;
                    }
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
                this.canvas.height
            );
        }

        drawTile(x, y, color) {

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, tileWidth, tileHeight);
        }
        reset() {
            this.health = 100;
            this.npcPool = [];
            this.spells = [];
            this.player.x = 200;
            this.player.y = 150;
        }
        update() {
            this.player.update(); 

            if (this.health <= 0) {
                this.reset(); // Reset the game
            }
            this.npcPool.forEach((npc, npcIndex) => {
                npc.update(this.spells, this);

                if (npc.x === npc.targetX && npc.y === npc.targetY) {
                    this.npcPool.splice(npcIndex, 1);
                    game.player.health -= 5;
                    this.health -= 5;

                }
            });
            this.npcPool.forEach((npc, npcIndex) => {
                if (npc.hitDelay > 0) {
                    npc.hitDelay -= 1000 / 8;
                    if (npc.hitDelay <= 0) {
                        this.npcPool.splice(npcIndex, 1);
                        this.audio2.play();
                        if(Math.random()*10>8){
                        this.tressurePool.push(new Tressure(this.player, npc.x, npc.y));
                }}}
            });
            
            this.tressurePool.forEach((tressure) => {
                tressure.update();
            })
            this.bombPool.forEach((bomb) => {
                bomb.update();
                if(bomb.frameX ===11){
                    this.bombPool.splice(this, 1);
                }
            })
            this.spells.forEach((spell, spellIndex) => {
                spell.update();

                this.npcPool.forEach((npc, npcIndex) => {
                    if (spell.x < npc.x + npc.width &&
                        spell.x + spell.width > npc.x &&
                        spell.y < npc.y + npc.height &&
                        spell.y + spell.height > npc.y) {
                        npc.hitDelay = 1000;
                        npc.isHit = true;
                        npc.maxFrame = 3;
                        this.spells.splice(spellIndex, 1);
                    }
                });

                if (spell.x < 0 || spell.y < 0 || spell.x > canvas.width || spell.y > canvas.height) {
                    this.spells.splice(spellIndex, 1);
                }
            });
        }

        draw(ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.drawBackground();
            this.drawMap();
            this.player.draw(ctx);
            
            this.tressurePool.forEach((tressure) => {
                tressure.draw(ctx);
            });
            this.bombPool.forEach((bomb) => {
                bomb.draw(ctx);
            })    
            this.npcPool.forEach((npc) => {
                npc.draw(ctx);
            });
            this.spells.forEach(spell => {
                spell.draw(ctx);
            });
            // ctx.fillStyle = "white";
            // ctx.font = "20px Arial";
            // ctx.fillText(`Health: ${this.health}`, 10, 30);
        }
    }
    const game = new Game();

    var lastTime;
    var requiredElapsed = 1000 / 45; 

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
