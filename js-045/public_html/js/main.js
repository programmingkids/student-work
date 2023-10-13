var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#6A5ACD');
    
    // メインシーン
    
    this.createMap();
    this.createPlayer();
    this.createEnemy09Group();
    this.createEnemy10Group();
    this.createBoss();
    this.createbossattackgroup();
    this.createplayerattackgroup();
    this.createUI();
    this.createZone();
};

mainScene.update = function() {
    if(this.isGameOver) {
        return false;
    }
    // プレイヤーの操作処理
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-this.runSpeed);
        this.player.anims.play('left',true);
        this.player.direction = 'left';
        
    }else if ( this.cursors.right.isDown ){
        this.player.setVelocityX(this.runSpeed);
        this.player.anims.play('right',true);
        this.player.direction = 'right';
    } else {
        this.player.setVelocityX ( 0 );
        this.player.anims.stop();
    }
    if(this.cursors.up.isDown && this.player.body.onFloor()){
        this.player.setVelocityY ( -this.jumpPower );
    }
    this.moveboss();
};

mainScene.config = function () {
    this.runSpeed = 500;
    // プレイヤーのジャンプパワー
    this.jumpPower = 700;
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // スコアの初期値
    this.score = 0;
    // 敵の配列
    this.enemyData = ['enemy01','enemy02','enemy05','enemy07','enemy08'];
    // 敵のスピードを設定する配列
    this.enemySpeed = [-200,-100,100,200];
    // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enemyjumppower = 600;
    
};

mainScene.createMap = function() {
    // マップ表示
    this.map = this.make.tilemap({key: 'map01'});
    var groundTiles = this.map.addTilesetImage('tiles');
    this.groundLayer = this.map.createDynamicLayer('Actiongame',groundTiles,0,0);
    this.groundLayer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
    this.cameras.main.centerOn(50,850);
};

mainScene.createPlayer = function() {
    // プレイヤー作成
    this.player = this.physics.add.sprite(50, 850, 'player');
    // 衝突サイズの調整
    // 表示サイズを変更する前に、物理エンジンでの判定サイズの変更
    this.player.body.setSize(20,25);
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(70,70);
    // プレイヤーの最初の向きは右
    this.player.setFrame(7);
    this.player.direction = 'right';
    // プレイヤーの衝突時のバウンス設定
    this.player.setBounce(0);
    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.player.setCollideWorldBounds(true);
    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.groundLayer);
    this.player.hp = 5;
    
    
    // 左向きのアニメーション
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.cameras.main.startFollow(this.player);
    
    this.input.keyboard.on('keydown-SPACE',function(event){
        this.playerattack();
    },this);
};
mainScene.createEnemy09Group = function() {
    // 敵グループ作成
    this.enemy09Group = this.physics.add.group();
    this.createEnemy09();
    this.physics.add.collider(this.enemy09Group,this.groundLayer);
    this.physics.add.overlap(this.player,this.enemy09Group,this.hitEnemy,null,this);
    this.enemy09Timer = this.time.addEvent({
        delay: 2000,
        callback: this.createEnemy09,
        loop:true,
        callbackScope: this
    });
};
mainScene.createEnemy10Group = function() {
    // 敵グループ作成
    this.enemy10Group = this.physics.add.group();
    this.createEnemy10();
    this.physics.add.collider(this.enemy10Group,this.groundLayer);
    this.physics.add.overlap(this.player,this.enemy10Group,this.hitEnemy,null,this);
    this.enemy10Timer = this.time.addEvent({
        delay: 2000,
        callback: this.createEnemy10,
        loop:true,
        callbackScope: this
    });
};
mainScene.createEnemy09 = function(){
    
    var position09 = [ 
        {
            x : 770,
            y : 1270,
        },
        {
            x : 1750,
            y : 1100,
        },
    ];
    var p09 = Phaser.Math.RND.pick(position09);
    var x09 = p09.x;
    var y09 = p09.y;
    var enemy09 = this.enemy09Group.create(x09,y09,'enemy09');
    //enemy09.body.setSize(350,350);
    enemy09.setDisplaySize(100,100);
    var speed09 = Phaser.Math.RND.pick(this.enemySpeed);
    enemy09.setVelocityX(speed09);
};
mainScene.createEnemy10 = function(){
    var position10 = [
            {
                x: 3080,
                y: 1100,
            },
            {
                x: 3850,
                y: 1100,
            },
            {
                x: 5880,
                y: 1100,
            },    
        ];
    var p10 = Phaser.Math.RND.pick(position10);
    var x10 = p10.x;
    var y10 = p10.y;
    var enemy10 = this.enemy10Group.create(x10,y10,'enemy10');
    enemy10.setDisplaySize(100,100);
    var speed10 = Phaser.Math.RND.pick(this.enemySpeed);
    enemy10.setVelocityX(speed10);
    enemy10.body.setAllowGravity(false);
};

mainScene.createBoss = function(){
    this.boss = this.physics.add.image(7000,1070,'enemy09');
    this.boss.setDisplaySize (300,300);
    this.boss.dx = -5;
    this.boss.hp = 5;
    var bossspeed = Phaser.Math.RND.pick(this.enemySpeed);
    
    
    this.physics.add.collider(this.boss, this.groundLayer);
    this.physics.add.overlap(this.boss,this.player,this.hitboss,null,this)
    
    this.bossjumptimer=this.time.addEvent({
        delay: 3000,
        callback:this.bossjump,
        loop: true,
        callbackScope: this,
    });
    this.bossattacktimer=this.time.addEvent({
        delay: 2000,
        callback: this.bossattack,
        loop: true,
        callbackScope: this,
    });
};
mainScene.hitboss = function(boss,player){
    this.gameOver();
}

mainScene.moveboss = function(){
    if(this.boss.x > 7000){
        this.boss.dx = -this.boss.dx;
    }
    if( this.boss.x < 6700){
        this.boss.dx = -this.boss.dx;
    }
    this.boss.x += this.boss.dx;
        
};    
mainScene.bossjump = function(){
    this.boss.setVelocityY(-this.enemyjumppower);
};
mainScene.createbossattackgroup = function(){
    this.bossattackgroup = this.physics.add.group();
    this.physics.add.overlap(this.player,this.bossattackgroup,this.hitbossattack,null,this);
    
    
};
mainScene.bossattack = function(){
    
    var posX = this.boss.x;
    var posY = this.boss.y;
    var enemyattack = this.bossattackgroup.create(posX,posY,'ball03');
    enemyattack.setVelocityX(-300);
    enemyattack.setDisplaySize(50,50);
    enemyattack.body.setAllowGravity(false);
    
    
};
mainScene.hitbossattack = function(player,bossattack){
    bossattack.destroy();
    this.player.hp -= 1;
    this.hptext.setText('HP: ' + this.player.hp);
    if(this.player.hp <= 0){
        this.gameOver();

    }
};
mainScene.createplayerattackgroup = function(){
    this.playerattackgroup = this.physics.add.group();
    this.physics.add.overlap(this.boss,this.playerattackgroup,this.hitplayerattack2,null,this);
    this.physics.add.overlap(this.enemy09Group,this.playerattackgroup,this.hitplayerattack,null,this);
    this.physics.add.overlap(this.enemy10Group,this.playerattackgroup,this.hitplayerattack,null,this);
    this.physics.add.collider(this.playerattackgroup,this.groundLayer,this.hitLayer,null,this);
};
mainScene.playerattack = function(){
    var posX = this.player.x;
    var posY = this.player.y;
    var playerattack = this.playerattackgroup.create(posX,posY,'ball04');
    playerattack.setDisplaySize(50,50);
    playerattack.body.setAllowGravity(false);
    if( this.player.direction == 'right') {
        playerattack.setVelocityX(900);
    }else{
        playerattack.setVelocityX(-900);
    }
    
};

mainScene.hitplayerattack = function(enemy,playerattack){
    playerattack.destroy();
    enemy.destroy();
};
mainScene.hitplayerattack2= function(boss,playerattack){
    playerattack.destroy();
    this.boss.hp -= 1;
    if(this.boss.hp <= 0){
        this.gameClear();
    }
};
mainScene.hitLayer = function(playerattack,layer){
    playerattack.destroy();
};
mainScene.hitEnemy= function(player,enemy){
    enemy.destroy();
    this.player.hp -= 1;
    this.hptext.setText('HP: ' + this.player.hp);
    if(this.player.hp <= 0){
        this.gameOver();
    }
};
mainScene.createUI = function(){
    this.hptext = this.add.text(600,20,"HP: " + this.player.hp,{
        font:'28px Open Sans',
        fill: '#ff0000'
    });
    this.hptext.setScrollFactor(0);
};

mainScene.createZone = function() {
    this.zone1 = new Phaser.GameObjects.Zone(
        this,
        2800, // x
        1350, // y
        280, // width
        50,  // height
    );
    this.zone1.setOrigin(0, 0);
    this.physics.add.existing(this.zone1);
    this.zone1.body.setAllowGravity(false);
    
    this.zone2 = new Phaser.GameObjects.Zone(
        this,
        3780, // x
        1350, // y
        280, // width
        50,  // height
    );
    this.zone2.setOrigin(0, 0);
    this.physics.add.existing(this.zone2);
    this.zone2.body.setAllowGravity(false);
    
    this.zone3 = new Phaser.GameObjects.Zone(
        this,
        4270, // x
        1350, // y
        280, // width
        50,  // height
    );
    this.zone3.setOrigin(0, 0);
    this.physics.add.existing(this.zone3);
    this.zone3.body.setAllowGravity(false);
    
    this.zone4 = new Phaser.GameObjects.Zone(
        this,
        4760, // x
        1350, // y
        210, // width
        50,  // height
    );
    this.zone4.setOrigin(0, 0);
    this.physics.add.existing(this.zone4);
    this.zone4.body.setAllowGravity(false);
    
    this.zone5 = new Phaser.GameObjects.Zone(
        this,
        5440, // x
        1350, // y
        420, // width
        50,  // height
    );
    this.zone5.setOrigin(0, 0);
    this.physics.add.existing(this.zone5);
    this.zone5.body.setAllowGravity(false);
    
    this.physics.add.overlap(this.player, this.zone1, this.hitZone, null,this);
    this.physics.add.overlap(this.player, this.zone2, this.hitZone, null,this);
    this.physics.add.overlap(this.player, this.zone3, this.hitZone, null,this);
    this.physics.add.overlap(this.player, this.zone4, this.hitZone, null,this);
    this.physics.add.overlap(this.player, this.zone5, this.hitZone, null,this);
};

mainScene.hitZone = function(player, zone) {
    this.gameOver();
};

mainScene.gameOver = function() {
    this.isGameOver = true;
    this.player.setTint(0xff0000);
    this.player.anims.stop();
    this.physics.pause();
    this.time.addEvent({
        delay: 800,
        callback: this.moveScene,
        loop: false,
        callbackScope: this,
        args: ["gameoverscene"],
    });
};

mainScene.gameClear = function() {
    this.boss.destroy();
    this.bossattacktimer.remove();
    this.bossjumptimer.remove();
    this.isGameOver = true;

    this.time.addEvent({
        delay: 1000,
        callback: this.moveScene,
        loop: false,
        callbackScope: this,
        args: ["gameclearscene"],
    });
};


mainScene.moveScene = function(sceneName) {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
        this.scene.start(sceneName);
    }, this);
};
