var bossScene = new Phaser.Scene("bossScene");

bossScene.create = function (data) {
    // 初期設定メソッド呼び出し
    this.config(data);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    //UI
    this.createUI();
    
    //マップ表示
    this.createMap();
    
    //プレイヤー作成
    this.createPlayer();
    
    //ボール作成
    this.createBallGroup();
    
    //ボス作成
    this.createBoss();
    
    //回転角度
    this.angle = 0;
};


bossScene.update = function() {
    if(this.isGameOver) {
        return false;
    }
    //プレイヤーの操作処理
    
    if(this.cursors.left.isDown) {
        //左カーソルキーをクリック
        this.player.setVelocityX(-this.runSpeed);
        this.player.anims.play('left',true);
        this.player.direction =  'left';
    }
    else if(this.cursors.right.isDown) {
        //右カーソルキーをクリック
        this.player.setVelocityX(this.runSpeed);
        this.player.anims.play('right',true);
        this.player.direction = 'right';
    } else {
        //キーを離したとき
        this.player.setVelocityX(0);
        this.player.anims.stop();
    }
    //上カーソルキーをクリックした時にジャンプ
    if(this.cursors.up.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-this.jumpPower);
    }
    //ボスの左右移動
    
    if(this.boss.x > 650) {
        this.boss.dx = -this.boss.dx;
        this.boss.direction = 'left';
    }
    if(this.boss.x < 150) {
       this.boss.dx = -this.boss.dx;
       this.boss.direction = 'right';
    }
    this.boss.x += this.boss.dx;
        
    
};

bossScene.config = function (data) {
    // プレイヤーの動く速度
    this.runSpeed = 400;
    // プレイヤーのジャンプパワー
    this.jumpPower = 500;
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enemySpeed = [100,150];
    this.score = data.score;
};
bossScene.createMap = function() {

    // マップ表示
    //jnos形式のマップデータの読み込みTilemapオブジェクトの作成
    this.map = this.make.tilemap({key:'map08'});

    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    var layerWidth = 18 * 16 * 3;
    var layerHeight = 18 * 12 * 3;
    
    //タイル画像をマップデータに反映するTilesetオブジェクトの作成
    var groundTiles = this.map.addTilesetImage('tile');
    
    //地面レイヤーの作成DynamicTilemapLayterオブジェクトの作成
    this.groundLayer = this.map.createDynamicLayer('ground',groundTiles,0,0);
    this.groundLayer.setDisplaySize(layerWidth, layerHeight);
    //衝突判定から除外したいタイルのインデックス配列を指定する
    //「ー１」はからのタイルなので衝突しない。それ以外は衝突する
    this.groundLayer.setCollisionByExclusion([-1]);
    
    // ゲームワールドの幅と高さの設定
    this.physics.world.bounds.width = this.groundLayer.displayWidth;
   this.physics.world.bounds.height = this.groundLayer.displayHeight;
    // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // カメラの初期位置は左下にする
    this.cameras.main.centerOn(50,950);
};

bossScene.createUI = function() {
    //ui作成
    var scoreText = 'スコア' + this.score;
    //画面右上に赤色でテキスト表示
    this.text = this.add.text(600,20,scoreText, {
        fontSize: '30px',
        fill: '#ff0000',
        fontStyle: 'bold'
    })
    //文字は固定表示（カメラに合わせて移動しない）
    this.text.setScrollFactor(0);
};
bossScene.createPlayer = function() {
    
    //プレイヤー作成
    this.player = this.physics.add.sprite(50,250,'player');
    // 表示サイズを変更する前に、物理エンジンでの判定サイズの変更
    this.player.body.setSize(20,25);
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(70,70);
    // プレイヤーの最初の向きは右
    this.player.setFrame(7);
    this.player.direction = 'right';
    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.groundLayer);
    //カメラはプレイヤーを追跡する。移動に合わせてカメラが移動する
    this.cameras.main.startFollow(this.player);
    this.player.setCollideWorldBounds(true);
    
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
    //スペースキーでボール発射
    this.input.keyboard.on('keydown-SPACE',function(event) {
        this.shoot();
    },this);
};

bossScene.createBallGroup = function() {
    this.ballGroup = this.physics.add.group();
    this.physics.add.collider(this.groundLayer,this.ballGroup,this.hitLayer,null,this);
};

bossScene.shoot = function() {
    var posX = this.player.x;
    var posY = this.player.y;
    var ball = this.ballGroup.create(posX,posY,'ball');
    var speed = 700;
    if(this.player.direction == 'right') {
       //プレイヤーの向きに合わせてボール発射
        ball.setVelocityX(speed);
        
    } else {
        ball.setVelocityX(-speed);
    }
     //ボールの各種設定
    ball.setDisplaySize(20,20);
    ball.body.setAllowGravity(false);
};

bossScene.hitLayer = function(ball, layer) {
    //ボール消滅
    ball.destroy();
};

bossScene.createBoss = function() {
   //ボス作成
   this.boss = this.physics.add.image(500,200,'boss');
   // 中心位置の調整
   this.boss.body.setOffset(70, 250);
   // 衝突範囲の設定
   this.boss.body.setSize(320,200, false);
   //ボスの表示サイズ変更
   this.boss.setDisplaySize(300,300);
   
   //ボスのHP
   this.boss.hp = 15; 
   
   //移動量
   this.boss.dx = 2;
   this.boss.direction = 'left';
   //ボスと地面の衝突
   this.physics.add.collider(this.boss,this.groundLayer);
   //ボスとボールグループの衝突
   this.physics.add.overlap(this.boss,this.ballGroup,this.hitBall,null,this);
   //プレイヤーとボスの衝突
   this.physics.add.overlap(this.player,this.boss,this.hitBoss,null,this);
   //2秒ごとにジャンプする
   this.bossJumpTimer = this.time.addEvent({
       delay:2500,
       callback: this.bossJump,
       loop: true,
       callbackScope: this,
   });
   //ファイヤー作成
   this.fireGroup = this.physics.add.group();
   //1秒ごとに作成
   this.fireTimer = this.time.addEvent({
       delay: 1500,
       callback: this.createFire,
       loop: true,
       callbackScope: this
   });
   //プレイヤーとファイヤー
   this.physics.add.overlap(this.player,this.fireGroup,this.hitFire,null,this);
};

bossScene.createFire = function() {
    var x = this.boss.body.center.x;
    var y = this.boss.body.center.y;
    
    //ファイヤー作成
    var fire = this.fireGroup.create(x,y,'fire');
    //fire.body.setSize(10,10);
    fire.setDisplaySize(50,50);
    fire.body.setAllowGravity(false);
    
    //速度
    var speed = 250;
    if(this.boss.direction == 'right') {
       //bossの向きに合わせてボール発射
        fire.setVelocityX(speed);
    } else {
        fire.setVelocityX(-speed);
    }

};

bossScene.hitFire = function(player,fire) {
    this.isGameOver = true;
    fire.destroy();
    this.player.setTint(0xff0000);
    //攻撃停止
    this.fireTimer.remove();
    //ジャンプの停止
    this.bossJumpTimer.remove();
    this.player.anims.stop();
    this.physics.pause();
    //ゲームオーバー
    this.time.addEvent(({
        delay: 1000,
        callback:this.gameOver,
        loop:false,
        callbackScope:this
    }));
};
bossScene.bossJump = function() {
    //ボスが着地
    if(this.boss.body.onFloor()) {
        //ジャンプ
        this.boss.setVelocityY(-400);
    }
}

bossScene.hitBoss = function(player,boss) {
    this.isGameOver = true;
    this.player.setTint(0xff0000);
    //攻撃停止
    this.fireTimer.remove();
    //ジャンプの停止
    this.bossJumpTimer.remove();
    this.player.anims.stop();
    this.physics.pause();
    //ゲームオーバー
    this.time.addEvent(({
        delay: 1000,
        callback:this.gameOver,
        loop:false,
        callbackScope:this
    }));
   
};

bossScene.hitBall = function(boss,ball) {
    ball.destroy();
    //HP減少
    this.boss.hp--;
    //HPが0
    if(this.boss.hp <= 0) {
        //ゲームクリア
        this.isGameOver = true;
        this.boss.setTint(0xA52A2A);
        this.bossJumpTimer.remove();
        this.fireTimer.remove();
        this.player.anims.stop();
        this.physics.pause();
        this.time.addEvent(({
        delay: 1000,
        callback:this.gameClear,
        loop:false,
        callbackScope:this
        }));
    }
};

bossScene.gameClear = function() {
   //ゲームクリアシーンに移動
   this.scene.start('clearScene');
};

bossScene.gameOver = function() {
    // ゲームオーバー処理
    //現在のカメラの中心座標を取得
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    //ゲームオーバー画像を画面中央に表示
    var gameoverImage = this.add.image(cameraPositionX,cameraPositionY,'gameover');
    gameoverImage.setDisplaySize(500,400);
    //なにかのキーをクリックするとゲーム再開
    this.input.keyboard.on('keydown',function(event) {
        this.scene.start('startScene');
        
    },this);
};