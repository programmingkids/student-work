var mainScene2 = new Phaser.Scene("mainScene2");

mainScene2.create = function (data) {
    // 初期設定メソッド呼び出し
    this.config(data);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#ff0032');
    
    this.createMap();
    
    this.createPlayer();
    
    this.createEnemyGroup();
    
    this.createBoxGroup();
    
    this.createBallGroup();
    
    this.createUI();
    
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

mainScene2.update = function() {
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

mainScene2.config = function (data) {
    this.runspeed = 150;
    this.jumpPower = 550;
    //this.score = ;
    this.data = data;
    this.ballcreate = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
};

mainScene2.createMap = function(){
    this.map = this.make.tilemap({key: 'map02'});
    var groundLayerTiles = this.map.addTilesetImage('tilesheet_complete');
    this.groundLayer = this.map.createDynamicLayer('ground' , groundLayerTiles, 0, 0);
    this.groundLayer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.cameras.main.centerOn(50,850);
    
};



mainScene2.createPlayer = function(){
    this.player = this.physics.add.sprite(50,3650,'player');
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

mainScene2.createEnemyGroup = function(){
    this.enemyGroup= this.physics.add.group();
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.overlap(this.enemyGroup, this.player, this.hitEnemy, null, this);
    this.enemyTimer = this.time.addEvent({
        delay:10000,
        callback:this.createEnemy,
        loop:true,
        callbackScope: this,
    });
};

mainScene2.createEnemy = function(){
    var positions = [{
        x : 1500,
        y : 3300,
    },{
        x : 800,
        y : 560,
    },{
        x : 640,
        y : 1800,
    }];
    var pos = Phaser.Math.RND.pick(positions);
    var enemy2 =  this.enemyGroup.create(pos.x, pos.y , 'enemy02');
    enemy2.body.setSize(60,45);
    enemy2.setDisplaySize(70,70);
    enemy2.body.setAllowGravity(false);
    var speedX = 150;
    enemy2.setVelocityX(speedX);
    enemy2.setBounce(1, 0);
};

mainScene2.hitEnemy = function(player, enemy){
    if(enemy.body.touching.up && player.body.touching.down){
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

mainScene2.createBoxGroup = function(){
    this.BoxGroup = this.physics.add.group();
    this.physics.add.collider(this.player,this.BoxGroup,this.hitBox, null,this);
    this.createBox();
};

mainScene2.createBox = function(){
    var box1 = this.BoxGroup.create( 1633,225 ,'tilesheet_complete', 195);
    box1.setDisplaySize(65,65);
    box1.setImmovable(true);
    box1.body.setAllowGravity(false);
    box1.isHit = false;
    var box2 = this.BoxGroup.create(1820, 2690, 'tilesheet_complete', 195);
    box2.setDisplaySize(65,65);
    box2.setImmovable(true);
    box2.body.setAllowGravity(false);
    box2.isHit = false;
    var box3 = this.BoxGroup.create(350,3490,'tilesheet_complete',195);
    box3.setDisplaySize(65,65);
    box3.setImmovable(true);
    box3.body.setAllowGravity(false);
    box3.isHit = false;
};

mainScene2.hitBox = function(player, box){
    if(player.body.touching.up && box.body.touching.down){
        if(!box.isHit){
            box.isHit = true;
            this.isShoot = true;
            this.ballcreate += 30;
            this.ballText.setText('発射可能回数:' + this.ballcreate);
        }
    }
};


mainScene2.createBallGroup = function(){
    this.BallGroup = this.physics.add.group();
    this.physics.add.collider(this.BallGroup, this.groundLayer);
    this.physics.add.collider(this.BoxGroup, this.BallGroup);
    this.physics.add.overlap(this.enemyGroup, this.BallGroup, this.hitBall, null, this);
};

mainScene2.createBall = function(){
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

mainScene2.deleteBall = function(ball){
    ball.destroy();
};

mainScene2.hitBall = function(enemy, ball){
    enemy.destroy();
    ball.destroy();
    this.data.score += 1;
    this.scoreText.setText('score:' + this.data.score);
};

mainScene2.createUI = function(){
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

mainScene2.createSign = function(){
    this.sign = this.physics.add.image(96,288, 'tilesheet_complete', 237);
    this.sign.body.setSize(60,60);
    this.sign.setDisplaySize(64,64);
    this.sign.setImmovable(true);
    this.sign.body.setAllowGravity(false);
    this.physics.add.collider(this.player, this.sign, this.hitSign, null, this);
};

mainScene2.hitSign = function(player, sign){
    if(player.body.touching.left && sign.body.touching.right){
        // ここで2面に行く
        this.data.score += 10;
        this.scene.start('mainScene3',this.data);
    }
};

mainScene2.gameOver = function(){
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
        this.scene.start('mainScene2');
        this.isGameOver = false;
        this.isHit = false;
    },this);
};