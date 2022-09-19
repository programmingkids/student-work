var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#ff0032');
    
    this.createMap();
    
    this.createPlayer();
    
    this.createEnemyGroup();
    
    this.createBoxGroup();
    
    this.createBallGroup();
    
    this.createUI();
    
    this.createStar();
    
    this.isShoot = false;
    
    this.isgetstar = false;
    
    this.createSign();
    
    this.input.keyboard.on('keydown-SPACE', function(event){
        if(this.isShoot == true && this.ballcreate > 0){
            this.createBall();
            this.ballcreate -= 1;
            this.ballText.setText('発射可能回数:' + this.ballcreate);
        }
    },this);

};

mainScene.update = function() {
    if(this.isGameOver == true){
        return false;
    }
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-this.runspeed);
        this.player.anims.play('walk', true);
        this.player.setFlipX(true);
        this.player.direction = 'left';
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(this.runspeed);
        this.player.anims.play('walk', true);
        this.player.setFlipX(false);
        this.player.direction = 'right';
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.stop();
    }
    if(this.cursors.up.isDown &&  this.player.body.onFloor()){
        this.player.setVelocityY(-this.jumpPower);
        this.player.anims.play('jump', true);
    }
};

mainScene.config = function () {
    this.runspeed = 150;
    this.jumpPower = 550;
    //this.score = 0;
    
    this.data = {};
    this.data.score = 0;
    this.ballcreate = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
};

mainScene.createMap = function(){
    this.map = this.make.tilemap({key: 'map01'});
    var groundLayerTiles = this.map.addTilesetImage('tilesheet_complete');
    this.groundLayer = this.map.createDynamicLayer('ground' , groundLayerTiles, 0, 0);
    this.groundLayer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.cameras.main.centerOn(50,850);
    
};



mainScene.createPlayer = function(){
    this.player = this.physics.add.sprite(50,850,'player');
    this.player.body.setSize(80,105);
    this.player.setDisplaySize(70,120);
    this.player.setFrame(0);
    this.player.direction = 'right';
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.groundLayer);
    this.anims.create({
        key:'walk',
        frames: this.anims.generateFrameNumbers('player',{start:9, end:17}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key:'jump',
        frames: this.anims.generateFrameNumbers('player',{start:1, end:3}),
        frameRate: 10,
        repeat: -1
    });
    this.cameras.main.startFollow(this.player);
};

mainScene.createEnemyGroup = function(){
    this.enemyGroup= this.physics.add.group();
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.overlap(this.enemyGroup, this.player, this.hitEnemy, null, this);
    this.enemyTimer = this.time.addEvent({
        delay:5000,
        callback:this.createEnemy,
        loop:true,
        callbackScope: this,
    });
};

mainScene.createEnemy = function(){
    var randomX = Phaser.Math.RND.between(1100, 5900);
    var enemy1 = this.enemyGroup.create(randomX,800, 'enemy01');
    enemy1.body.setSize(35, 45);
    enemy1.setDisplaySize(70,70);
    var enemy2 =  this.enemyGroup.create(randomX, 550, 'enemy02');
    enemy2.body.setSize(60,45);
    enemy2.setDisplaySize(70,70);
    enemy2.body.setAllowGravity(false);
    var speedX = 150;
    enemy1.setVelocityX(speedX);
    enemy2.setVelocityX(speedX);
    enemy1.setBounce(1, 0);
    enemy2.setBounce(1, 0);
};

mainScene.hitEnemy = function(player, enemy){
    if(this.isgetstar == true){
        enemy.destroy();
        this.data.score += 1;
        this.scoreText.setText('score:' + this.data.score);
    }else if(enemy.body.touching.up && player.body.touching.down){
        enemy.destroy();
        this.data.score += 3;
        this.scoreText.setText('score:' + this.data.score);
    }else{
    this.physics.pause();
    this.isGameOver = true;
    this.player.anims.stop();
    this.enemyTimer.remove();
    this.gameOver();
    }
};

mainScene.createBoxGroup = function(){
    this.BoxGroup = this.physics.add.group();
    this.physics.add.collider(this.player,this.BoxGroup,this.hitBox, null,this);
    this.createBox();
};

mainScene.createBox = function(){
    var box1 = this.BoxGroup.create( 1633,225 ,'tilesheet_complete', 195);
    box1.setDisplaySize(65,65);
    box1.setImmovable(true);
    box1.body.setAllowGravity(false);
    box1.isHit = false;
    var box2 = this.BoxGroup.create(2655, 675, 'tilesheet_complete', 195);
    box2.setDisplaySize(65,65);
    box2.setImmovable(true);
    box2.body.setAllowGravity(false);
    box2.isHit = false;
    var box3 = this.BoxGroup.create(300,700,'tilesheet_complete',195);
    box3.setDisplaySize(65,65);
    box3.setImmovable(true);
    box3.body.setAllowGravity(false);
    box3.isHit = false;
};

mainScene.hitBox = function(player, box){
    if(player.body.touching.up && box.body.touching.down){
        if(!box.isHit){
            box.isHit = true;
            this.isShoot = true;
            this.ballcreate += 20;
            this.ballText.setText('発射可能回数:' + this.ballcreate);
        }
    }
};


mainScene.createBallGroup = function(){
    this.BallGroup = this.physics.add.group();
    this.physics.add.collider(this.BallGroup, this.groundLayer);
    this.physics.add.collider(this.BoxGroup, this.BallGroup);
    this.physics.add.overlap(this.enemyGroup, this.BallGroup, this.hitBall, null, this);
};

mainScene.createBall = function(){
    var playerX = this.player.body.center.x;
    var playerY = this.player.body.center.y;
    var ball =this.BallGroup.create(playerX,playerY,'ball');
    ball.setDisplaySize(20,20);
    ball.setBounce(0.7);
    var speed = 500;
    if(this.player.direction == "right"){
        ball.setVelocityX(speed);
    }
    if(this.player.direction == "left"){
        ball.setVelocityX(-speed);
    }
     
    this.ballTimer = this.time.addEvent({
        delay:5000,
        callback:this.deleteBall,
        loop:false,
        callbackScope:this,
        args:[ball]
    });
        
};

mainScene.deleteBall = function(ball){
    ball.destroy();
};

mainScene.hitBall = function(enemy, ball){
    enemy.destroy();
    ball.destroy();
    this.data.score += 1;
    this.scoreText.setText('score:' + this.data.score);
};

mainScene.createUI = function(){
    this.scoreText = this.add.text(650, 550,"score:" + this.data.score,{
        font:'28px Open Sans',
        fill:'#0000FF'
    });
    this.ballText = this.add.text(300, 100, "発射可能回数:" + this.ballcreate,{
        font:'28px Open Sans',
        fill:'#0000FF'
    });
    this.scoreText.setScrollFactor(0);
    this.ballText.setScrollFactor(0);
};

mainScene.createStar = function(){
    var starPositionX = Phaser.Math.RND.between(1900,3700);
    this.star = this.physics.add.image(starPositionX,700, 'star');
    this.star.body.setSize(65,65);
    this.star.setDisplaySize(70,70);
    this.star.setBounce(0.5);
    this.physics.add.collider(this.player, this.star, this.getStar, null, this);
    this.physics.add.collider(this.groundLayer, this.star);
};

mainScene.getStar = function(player, star){
    star.destroy();
    this.isgetstar = true;
    this.player.setTint(0xFFFF00);
    this.starTImer = this.time.addEvent({
        delay:10000,
        callback:this.getStarFalse,
        loop:false,
        callbackScope: this
    }); 
};

mainScene.getStarFalse = function(){
    this.isgetstar = false;
    this.player.clearTint();
};

mainScene.createSign = function(){
    this.sign = this.physics.add.image(6300,864, 'tilesheet_complete', 236);
    this.sign.body.setSize(60,60);
    this.sign.setDisplaySize(64,64);
    this.sign.setImmovable(true);
    this.sign.body.setAllowGravity(false);
    this.physics.add.collider(this.player, this.sign, this.hitSign, null, this);
};

mainScene.hitSign = function(player, sign){
    if(player.body.touching.right && sign.body.touching.left){
        // ここで2面に行く
        this.data.score += 10;
        this.scene.start('mainScene2', this.data);
    }
};

mainScene.gameOver = function(){
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    var gameOverImage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    var text = this.data.score;
    gameOverImage.setDisplaySize(800,600);
    var score = this.add.text(cameraPositionX-100, cameraPositionY-300, 'score:' + text,{
        font:'80px Open Sans',
        fill:'#0000FF'
    });
    this.isShoot = false;
    this.isGameOver = true;
    this.scoreText.setVisible(false);
    this.ballText.setVisible(false);
    this.input.keyboard.on('keydown', function(event){
        this.scene.start('mainScene');
        this.isGameOver = false;
        this.isHit = false;
    },this);
};