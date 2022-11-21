var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    //マップ表示
    this.createMap();
    
    //UI作成
    this.createUI();

    //プレイヤーの作成
    this.createPlayer();
    
    //敵作成
    this.createEnemyGroup();
    
    //敵作成2
    this.createEnemyGroup2();
    
    //敵作成3
    this.createEnemyGroup3();
    
    //敵作成４
    this.createEnemyGroup4();
    //
    this.createEnemyGroup5();
    
    //ボール作成
    this.createBallGroup();
    
    //扉作成
    this.createDoor();
    
    //アイテム作成
    this.createItem();
    
    
};

mainScene.update = function() {
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
};

mainScene.config = function () {
    this.score = 0;
    // プレイヤーの動く速度
    this.runSpeed = 400;
    // プレイヤーのジャンプパワー
    this.jumpPower = 500;
     this.enemyType = ["enemy01","enemy02","enemy03","enemy04","enemy05"];
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enemySpeed = [100,150];
    this.isGetItem = false;
};
mainScene.createMap = function() {
    // マップ表示
    //jnos形式のマップデータの読み込みTilemapオブジェクトの作成
    this.map = this.make.tilemap({key:'map04'});

    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    var layerWidth = 18 * 70 * 3;
    var layerHeight = 18 * 34 * 3;
    
    //タイル画像をマップデータに反映するTilesetオブジェクトの作成
    var groundTiles = this.map.addTilesetImage('tile');
    
    //地面レイヤーの作成DynamicTilemapLayterオブジェクトの作成
    this.groundLayer = this.map.createDynamicLayer('ground',groundTiles,0,0);
    this.groundLayer.setDisplaySize(layerWidth, layerHeight);
    //衝突判定から除外したいタイルのインデックス配列を指定する
    //「ー１」はからのタイルなので衝突しない。それ以外は衝突する
    this.groundLayer.setCollisionByExclusion([-1]);
    
    //地面レイヤーの作成DynamicTilemapLayterオブジェクトの作成
    this.environmentLayer = this.map.createDynamicLayer('environment',groundTiles,0,0);
    this.environmentLayer.setDisplaySize(layerWidth, layerHeight);
    //衝突判定から除外したいタイルのインデックス配列を指定する
    //「ー１」はからのタイルなので衝突しない。それ以外は衝突する
    this.environmentLayer.setCollisionByExclusion([-1]);

    
    // ゲームワールドの幅と高さの設定
    this.physics.world.bounds.width = this.groundLayer.displayWidth;
    this.physics.world.bounds.height = this.groundLayer.displayHeight;
    // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // カメラの初期位置は左下にする
    this.cameras.main.centerOn(50,950);
};
    
mainScene.createEnemyGroup = function() {
    //グループを作成
    this.enemyGroup = this.physics.add.group();
    //2秒ごとに敵作成
    this.enemyTimer = this.time.addEvent({
        delay:2000,
        callback:this.createEnemy,
        loop:true,
        callbackScope:this
    });
    //衝突処理
    this.physics.add.collider(this.enemyGroup,this.groundLayer);
    this.physics.add.overlap(this.enemyGroup,this.player,this.hitEnemy,null,this);
};

mainScene.createEnemy = function() {
    //敵の初期位置をランダムにする
    //var enemyPositionX = Phaser.Math.RND.between(200,3000);
    //var enemyPositionY = Phaser.Math.RND.between(0,100);
    //敵作成
    var enemy = this.enemyGroup.create(1000,1600,'enemy01');
    //var enemy = this.enemyGroup.create(300,300,'enemy02');
    
    //敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(70,70);
    //右に加速
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(speed);
  
}

mainScene.createEnemyGroup2 = function() {
    //グループを作成
    this.enemyGroup2 = this.physics.add.group();
    //2秒ごとに敵作成
    this.enemyTimer = this.time.addEvent({
        delay:1500,
        callback:this.createEnemy2,
        loop:true,
        callbackScope:this
    });
    //衝突処理
    this.physics.add.collider(this.enemyGroup2,this.groundLayer);
    this.physics.add.overlap(this.enemyGroup2,this.player,this.hitEnemy,null,this);
};

mainScene.createEnemy2 = function() {
    //敵の初期位置をランダムにする
    //var enemyPositionX = Phaser.Math.RND.between(200,3000);
    //var enemyPositionY = Phaser.Math.RND.between(0,100);
    //敵作成
    var enemy = this.enemyGroup2.create(1200,700,'enemy02');
    
    //敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(70,70);
    //左に加速
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(-speed);
  
}

mainScene.createEnemyGroup3 = function() {
    //グループを作成
    this.enemyGroup3 = this.physics.add.group();
    //2秒ごとに敵作成
    this.enemyTimer = this.time.addEvent({
        delay:2000,
        callback:this.createEnemy3,
        loop:true,
        callbackScope:this
    });
    //衝突処理
    this.physics.add.collider(this.enemyGroup3,this.groundLayer);
    this.physics.add.overlap(this.enemyGroup3,this.player,this.hitEnemy,null,this);
};

mainScene.createEnemy3 = function() {
    //敵の初期位置をランダムにする
    //var enemyPositionX = Phaser.Math.RND.between(200,3000);
    //var enemyPositionY = Phaser.Math.RND.between(0,100);
    //敵作成
    var enemy = this.enemyGroup3.create(2300,1600,'enemy03');
    //var enemy = this.enemyGroup.create(300,300,'enemy02');
    
    //敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(70,70);
    //右に加速
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(speed);
  
}

mainScene.createEnemyGroup4 = function() {
    //グループを作成
    this.enemyGroup4 = this.physics.add.group();
    //2秒ごとに敵作成
    this.enemyTimer = this.time.addEvent({
        delay:2300,
        callback:this.createEnemy4,
        loop:true,
        callbackScope:this
    });
    //衝突処理
    this.physics.add.collider(this.enemyGroup4,this.groundLayer);
    this.physics.add.overlap(this.enemyGroup4,this.player,this.hitEnemy,null,this);
};

mainScene.createEnemy4 = function() {
    //敵の初期位置をランダムにする
    //var enemyPositionX = Phaser.Math.RND.between(200,3000);
    //var enemyPositionY = Phaser.Math.RND.between(0,100);
    //敵作成
    var enemy = this.enemyGroup4.create(2300,800,'enemy04');
    
    //敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(70,70);
    //左に加速
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(-speed);
   enemy.jumptimer = this.time.addEvent({
       delay:3000,
       callback:this.jumpenemy04,
       loop:true,
       callbackScope:this,
       args:[enemy],
   });
};

mainScene.jumpenemy04 = function(enemy04) {
    enemy04.setVelocityY(-350);
};
mainScene.createEnemyGroup5 = function() {
    //グループを作成
    this.enemyGroup5 = this.physics.add.group();
    //2秒ごとに敵作成
    this.enemyTimer = this.time.addEvent({
        delay:2500,
        callback:this.createEnemy5,
        loop:true,
        callbackScope:this
    });
    //衝突処理
    this.physics.add.collider(this.enemyGroup5,this.groundLayer);
    this.physics.add.overlap(this.enemyGroup5,this.player,this.hitEnemy,null,this);
};
mainScene.createEnemy5 = function() {
    //敵の初期位置をランダムにする
    //var enemyPositionX = Phaser.Math.RND.between(200,3000);
    //var enemyPositionY = Phaser.Math.RND.between(0,100);
    //敵作成
    var enemy = this.enemyGroup5.create(2100,250,'enemy05');
    
    //敵のサイズ変更
    //enemy.body.setSize(350,350);
    enemy.setDisplaySize(70,70);
    //左に加速
    var enemyGroup5Speed = [-100,100,80,-80];
    var speed = Phaser.Math.RND.pick(enemyGroup5Speed);
    enemy.setVelocityX(speed);
  
}

mainScene.createPlayer = function() {

    //プレイヤー作成
    this.player = this.physics.add.sprite(50,950,'player');
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
    //プレイヤーが地面と衝突
    this.physics.add.collider(this.player,this.groundLayer);
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

mainScene.createUI = function() {
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
mainScene.createBallGroup = function() {
    this.ballGroup = this.physics.add.group();
    this.physics.add.overlap(this.ballGroup,this.enemyGroup,this.hitBall,null,this);
    this.physics.add.overlap(this.ballGroup,this.enemyGroup2,this.hitBall,null,this);
    this.physics.add.overlap(this.ballGroup,this.enemyGroup3,this.hitBall,null,this);
    this.physics.add.overlap(this.ballGroup,this.enemyGroup4,this.hitBall04,null,this);
    this.physics.add.overlap(this.ballGroup,this.enemyGroup5,this.hitBall,null,this);
    this.balllayercollider = this.physics.add.collider(this.groundLayer,this.ballGroup,this.hitLayer,null,this);
}

mainScene.shoot = function() {
    var posX = this.player.x;
    var posY = this.player.y;
    // ここを変更
    if(this.isGetItem == true) {
        var ball = this.ballGroup.create(posX,posY,'weapon');
    } else {
        var ball = this.ballGroup.create(posX,posY,'ball');
    }
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

mainScene.createItem = function() {
    //アイテム作成
    this.item = this.physics.add.sprite(2000,900,'item');
    this.item.setDisplaySize(40,40);
    this.item.body.setAllowGravity(false);
    //アイテムが地面と衝突
    this.physics.add.collider(this.item,this.groundLayer);
    this.physics.add.overlap(this.item,this.player,this.hititem,null,this);
    
    
};

mainScene.createDoor = function() {
    //ドア作成
    this.door = this.physics.add.sprite(3450,1080,'door');
    //サイズ
    this.door.setDisplaySize(50,50);
    this.door.body.setAllowGravity(false);
    //var doorPositionX = 1500;
    //var doorPositionY = 200;
    //ドアが地面と衝突した時の処理
    this.physics.add.collider(this.door,this.groundLayer);
    this.physics.add.overlap(this.door,this.player,this.hitdoor,null,this);
};

mainScene.hititem = function(item,plyer) {
    item.destroy();
    this.isGetItem = true;
    this.physics.world.removeCollider(this.balllayercollider);
}
mainScene.hitdoor = function(door,player) {
    this.scene.start("bossScene",{
        score:this.score,
    });
};
mainScene.hitBall = function(ball,enemy) {
    //ボール消滅
    ball.destroy();
    //敵消滅
    enemy.destroy();
    //スコアアップ
    this.score += 5;
    var scoreText = 'スコア'　+ this.score;
    this.text.setText(scoreText);
};

mainScene.hitBall04 = function(ball,enemy) {
    //ボール消滅
    ball.destroy();
    enemy.jumptimer.remove();
    //敵消滅
    enemy.destroy();
    //スコアアップ
    this.score += 5;
    var scoreText = 'スコア'　+ this.score;
    this.text.setText(scoreText);
};

mainScene.hitLayer = function(ball,layer) {
    //ボール消滅
    //if(this.isGetItem != true) {
        ball.destroy();
    //}
};
mainScene.hitEnemy = function(enemy,player) {
    //プレイヤーと敵の衝突
    //物理エンジン停止
    this.physics.pause();
　　 this.player.anims.stop();
    //ゲームオバーにしてupdateの動作停止
    this.isGameOver = true;
    //敵作成停止
    this.enemyTimer.remove();
    //1秒後にゲームオーバー画面
    this.time.addEvent(({
        delay: 0000,
        callback: this.gameOver,
        loop: false,
        callbackScope: this
    }));
};

mainScene.gameOver = function() {
    // ゲームオーバー処理
    //現在のカメラの中心座標を取得
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    //ゲームオーバー画像を画面中央に表示
    var gameoverImage = this.add.image(cameraPositionX,cameraPositionY,'gameover');
    gameoverImage.setDisplaySize(500,400);
    //なにかのキーをクリックするとゲーム再開
    this.input.keyboard.on('keydown',function(event) {
        this.scene.start('mainScene');
        
    },this);
    
};
