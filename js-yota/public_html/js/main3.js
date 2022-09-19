var mainScene3 = new Phaser.Scene("mainScene3");

mainScene3.create = function (data) {
    // 初期設定メソッド呼び出し
    this.config(data);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#ff0032');
    
    this.createMap();
    
    this.createPlayer();
    
    this.createBoss();
    
    this.createBallGroup();
    
    this.createUI();
    
    
    this.input.keyboard.on('keydown-SPACE', function(event){
            this.createBall();
    },this);

};

mainScene3.update = function() {
    if(this.isGameOver == true || this.isGameClear == true){
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
    var playerVector2 = this.player.getCenter();
    var bossVector2 = this.boss.getCenter();
    if(playerVector2.distance(bossVector2) >= 220){
        this.isCollide = false;
        this.player.clearTint();
    }
};

mainScene3.config = function (data) {
    this.runspeed = 150;
    this.jumpPower = 550;
    //this.score = ;
    this.data = data;
    this.ballcreate = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 200;
    this.isCollide = false;
    this.isGameClear = false;
};

mainScene3.createMap = function(){
    this.map = this.make.tilemap({key: 'map03'});
    var groundLayerTiles = this.map.addTilesetImage('tilesheet_complete');
    this.groundLayer = this.map.createDynamicLayer('ground' , groundLayerTiles, 0, 0);
    this.groundLayer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.cameras.main.centerOn(50,850);
};

mainScene3.createPlayer = function(){
    this.player = this.physics.add.sprite(50,1150,'player');
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
    this.player.hp = 3;
};

mainScene3.createBoss = function(){
    this.boss = this.physics.add.image(1080, 960, 'enemy03');
    this.boss.body.setSize(439,435);
    this.boss.setDisplaySize(300,250);
    this.boss.setVelocityX(this.speed);
    this.boss.setBounce(1);
    this.physics.add.overlap(this.player, this.boss,this.hitBoss,null,this);
    this.physics.add.collider(this.groundLayer, this.boss);
    this.boss.hp = 20;
};

mainScene3.hitBoss = function(player, boss){
    if(this.isCollide == true){
        return;
    }
    this.isCollide = true;
    if(!this.player.body.onFloor() && 
        this.player.body.touching.down && 
        this.boss.body.touching.up){
        this.boss.hp--;
        if(this.boss.hp <= 0){
            this.gameClear();
            this.boss.destroy();
        }
    }else{
        this.player.hp--;
        this.hpText.setText('hp:' + this.player.hp);
        this.player.setTint(0x0000ff);
        if(this.player.hp <= 0){
            this.gameOver();
        }
    }
};

mainScene3.createBallGroup = function(){
    this.BallGroup = this.physics.add.group();
    this.physics.add.collider(this.BallGroup, this.groundLayer);
};

mainScene3.createBall = function(){
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
    this.physics.add.overlap(this.boss, this.BallGroup, this.hitBall, null, this);
        
};

mainScene3.hitBall =function(boss,ball){
    ball.destroy();
    this.boss.hp --;
    if(this.boss.hp <= 0){
        boss.destroy();
        this.gameClear();
    }
};

mainScene3.deleteBall = function(ball){
    ball.destroy();
};

mainScene3.createUI = function(){
    this.scoreText = this.add.text(650, 550,"score:" + this.data.score,{
        font:'28px Open Sans',
        fill:'#0000FF'
    });
    this.ballText = this.add.text(300, 100, "発射可能回数:" + "∞",{
        font:'28px Open Sans',
        fill:'#0000FF'
    });
    this.hpText = this.add.text(30,100,"hp:" + this.player.hp,{
        font:'28px Open Sans',
        fill:'#0000FF'
    });
    this.scoreText.setScrollFactor(0);
    this.ballText.setScrollFactor(0);
    this.hpText.setScrollFactor(0);
};

mainScene3.gameOver = function(){
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    var gameOverImage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    var text = this.data.score;
    gameOverImage.setDisplaySize(800,600);
    var score = this.add.text(cameraPositionX-100, cameraPositionY-300, 'score:' + text,{
        font:'80px Open Sans',
        fill:'#0000FF'
    });
    this.physics.pause();
    this.player.anims.stop();
    this.isShoot = false;
    this.isGameOver = true;
    this.scoreText.setVisible(false);
    this.ballText.setVisible(false);
    
    this.input.keyboard.on('keydown', function(event){
        this.scene.start('mainScene3');
        this.isGameOver = false;
        this.isHit = false;
    },this);
};

mainScene3.gameClear = function(){
    this.isGameClear = true;
    this.data.score += 30;
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    var gameClearImage = this.add.image(cameraPositionX, cameraPositionY,'gameclear');
    gameClearImage.setDisplaySize(800,600);
    var text = this.data.score;
    var score = this.add.text(cameraPositionX-100, cameraPositionY-300, 'score:' + text,{
        font:'80px Open Sans',
        fill:'#0000FF'
    });
    this.physics.pause();
    this.player.anims.stop();
    this.scoreText.setVisible(false);
    this.ballText.setVisible(false);
};