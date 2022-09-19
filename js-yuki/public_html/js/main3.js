var mainScene3 = new Phaser.Scene("mainScene3");

mainScene3.create = function (data) {
    // 初期設定
    this.config(data);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#b428e2');
    
    // マップ表示
    this.createMap();
    
    // プレイヤー作成
    this.createPlayer();
    
    // UI作成
    this.createUI();
    
    // ボール作成
    this.createBallGroup();

    // スペースキーでボール発射
    this.input.keyboard.on('keydown-SPACE', function(event) {
        this.shoot();
    }, this);
    
    this.createBossEnemy();
    
    this.createBoneGroup();
    
    this.createGoalZone();
    this.createBoneGroup2();
};

mainScene3.update = function() {
    if(this.isGameOver) {
        return false;
    }
    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-this.runSpeed);
        this.player.anims.play('left', true);
        this.player.direction = 'left';
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(this.runSpeed);
        this.player.anims.play('right', true);
        this.player.direction = 'right';
    } else {
        this.player.setVelocityX(0);
        this.player.anims.stop();
    }
    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.player.setVelocityY(-this.jumpPower);
    }
    
    // ボスの左右の動き
    if(this.bossEnemy.x > this.groundLayer.width - this.bossEnemy.displayWidth / 2) {
        this.bossEnemy.dx *= -1;
    }
    if(this.bossEnemy.x < 450) {
        this.bossEnemy.dx *= -1;
    }
    this.bossEnemy.x += this.bossEnemy.dx;
};


// 初期設定
mainScene3.config = function(data) {
    // プレイヤーの動く速度
    this.runSpeed = 300;
    // プレイヤーのジャンプパワー
    this.jumpPower = 500;
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // スコアの初期値
    this.score = 0;
    // 敵の配列
    this.enemyData = ['enemy01','enemy02','enemy05','enemy07','enemy08'];
    // 敵のスピードを設定する配列
    this.enemySpeed = [-100,-50,50,100];
    // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();
    this.hp = 3;
    
    this.score = data.score != null ? data.score : 0;
    this.hp = data.hp != null ? data.hp : 3;
};

mainScene3.createMap = function() {
    // マップ表示
    // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
    this.map = this.make.tilemap({key: 'map03'});

    // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
    var groundTiles = this.map.addTilesetImage('tiles');
    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    this.groundLayer = this.map.createDynamicLayer('ground', groundTiles, 0, 0);
    
    // 衝突判定から除外したいタイルのインデックスを配列で指定する
    // 「-1」は空のタイルなので衝突しない。それ以外は衝突する
    this.groundLayer.setCollisionByExclusion([-1]);
    
    // ゲームワールドの幅と高さの設定
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // カメラの初期位置は左下にする
    this.cameras.main.centerOn(50, 850);
};

mainScene3.createPlayer = function() {
    // プレイヤー作成
    this.player = this.physics.add.sprite(50, 50, 'player');
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
        
    // カメラはプレイヤーを追跡する。プレイヤーの移動に合わせて、カメラが表示が移動する
    this.cameras.main.startFollow(this.player);
};


mainScene3.createUI = function() {
    // UI作成
    var scoreText = 'スコア：' + this.score;
    // 画面右上に赤色でテキスト表示
    this.text = this.add.text(600, 20, scoreText, {
        fontSize: '30px',
        fill: '#ff0000',
        fontStyle: 'bold'
    });
    // 文字は固定表示（カメラに合わせて移動しない）
    this.text.setScrollFactor(0);

    var hpText = 'HP：' + this.hp;
    // 画面右上に赤色でテキスト表示
    this.playerHpText = this.add.text(50, 20, hpText, {
        fontSize: '30px',
        fill: '#ff0000',
        fontStyle: 'bold'
    });
    // 文字は固定表示（カメラに合わせて移動しない）
    this.playerHpText.setScrollFactor(0);
};

mainScene3.createBossEnemy = function() {
    this.bossEnemy = this.physics.add.image(700, 300, 'enemy09');

    // 衝突範囲のサイズ変更、中心点を基準にしない
    this.bossEnemy.body.setSize(300, 270, false);
    // 左上からのオフセットの距離を設定
    this.bossEnemy.body.setOffset(90, 150);
    this.bossEnemy.setDisplaySize(300, 300);
    
    this.bossEnemy.setCollideWorldBounds(true);
    this.createEnemyParticle(this.bossEnemy);
    
    this.bossEnemy.dx = 4;
    this.bossEnemy.hp = 20;

    this.physics.add.collider(this.bossEnemy, this.groundLayer);
    this.physics.add.overlap(this.bossEnemy, this.ballGroup, this.hitBall, null, this);
    this.physics.add.overlap(this.player, this.bossEnemy, this.hitPlayerAndBossEnemy, null, this);
    
    this.bossJumpTimer = this.time.addEvent({
        delay: 2000,
        callback: this.bossEnemyJump,
        loop: true,
        callbackScope: this,
    });
    
    
};

mainScene3.createEnemyParticle = function(enemy) {
    // 敵の爆発パーティクル作成
    var particles = this.add.particles('fire02');
    enemy.emitter = particles.createEmitter({
        speed: 200,
        maxParticles: 60,
        blendMode: 'ADD',
        follow: enemy,
    });
    // 最初はパーティクルは停止
    enemy.emitter.stop();
};

mainScene3.bossEnemyJump = function() {
    if( this.bossEnemy.body.onFloor() ) {
        this.bossEnemy.setVelocityY(-400);
    }
};

mainScene3.hitPlayerAndBossEnemy = function(player, bossEnemy) {
    this.isGameOver = true;
    // 物理エンジン停止
    this.physics.pause();
    // プレイヤーを赤色にする
    this.player.setTint(0xff0000);
    // プレイヤーのアニメーション停止
    this.player.anims.stop();
    this.bossJumpTimer.remove();
    this.boneTimer.remove();
    this.boneTimer2.remove();
    // 1秒後にゲームオーバー画面
    this.time.addEvent({
      delay: 1000,
      callback: this.gameOver,
      loop: false,
      callbackScope: this
    });
};


mainScene3.gameOver = function() {
    // ゲームオーバー処理
    // 現在のカメラの中心座標を取得
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    // ゲームオーバー画像を画面中央に表示
    var gameoverImage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    gameoverImage.setDisplaySize(500,400);
    // 何かキーをクリックするとゲーム再開
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};

mainScene3.gameRestart = function() {
    this.isGameOver = false;
    this.player.setPosition(50, 50);
    this.physics.resume();
    this.player.clearTint();
    this.player.anims.resume();
    this.player.setFrame(7);
};

mainScene3.createBallGroup = function() {
    // ボールグループ作成
    this.ballGroup = this.physics.add.group();
    // ボールグループと地面の衝突
    this.physics.add.collider(this.ballGroup, this.groundLayer, this.hitBallAndGround, null, this);    
    // ボールグループと敵の衝突
    //this.physics.add.overlap(this.ballGroup, this.enemyGroup, this.hitBall, null, this);
};

mainScene3.shoot = function() {
    // プレイヤーの位置からボール発射
    var posX = this.player.x;
    var posY = this.player.y;
    // ボール作成
    var ball = this.ballGroup.create(posX, posY, 'ball05');
    ball.setDisplaySize(20, 20);
    ball.setBounce(1);
    ball.body.setAllowGravity(false);
    // プレイヤーの向きにボールを発射
    if( this.player.direction == 'right') {
        ball.setVelocityX(600);
    } else {
        ball.setVelocityX(-600);
    }
};

mainScene3.hitBallAndGround = function(ball, ground) {
    ball.destroy();
};

mainScene3.hitBall = function(bossEnemy, ball) {
    // ボールと敵の衝突
    ball.destroy();
    this.bossEnemy.hp--;
    
    if(this.bossEnemy.hp <= 0) {
        this.bossJumpTimer.remove();
        this.boneTimer.remove();
        this.boneTimer2.remove();
        this.bossEnemy.emitter.start();
        this.bossEnemy.destroy();
        // スコアアップ
        this.score += 100;
        var scoreText = 'スコア：' + this.score;
        this.text.setText(scoreText);
    }
};

mainScene3.createGoalZone = function() {
    this.goalZone = this.add.zone(70 * 15, 70 * 5, 70, 70 * 10);
    this.physics.add.existing(this.goalZone);
    this.goalZone.body.setAllowGravity(false);
    this.physics.add.overlap(this.player, this.goalZone, this.reachGoal, null, this);
};

mainScene3.reachGoal = function() {
    if(this.bossEnemy.active) {
        return;
    }
    
    this.isGameOver = true;
    this.physics.pause();
    this.player.anims.stop();
    
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    
    // フェードアウト完了後に実行する
    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
        // スタートシーンを起動します
        this.scene.start("gameClearScene");
    }, this);
};

mainScene3.createBoneGroup = function() {
    this.boneGroup = this.physics.add.group();
    this.physics.add.collider(this.boneGroup, this.groundLayer, this.hitBoneAndGround, null, this);
    this.physics.add.overlap(this.player, this.boneGroup, this.hitPlayerAndBone, null, this);
    
    this.boneTimer = this.time.addEvent({
        delay: 1500,
        callback : this.createBone,
        loop: true,
        callbackScope: this,
    });
};

mainScene3.createBone = function() {
    var x = this.bossEnemy.body.center.x;
    var y = this.bossEnemy.body.center.y;
    
    var bone = this.boneGroup.create(x, y, 'bone');
    bone.body.setSize(400, 180);
    bone.setDisplaySize(80, 80);
    bone.body.setAllowGravity(false);
    bone.setVelocityX(-500);
    
};

mainScene3.hitBoneAndGround = function(bone, ground) {
    bone.destroy();
};

mainScene3.hitPlayerAndBone = function(player, bone) {
    bone.destroy();
    this.hp--;
    this.cameras.main.flash(500, 255,0,0);
    this.playerHpText.setText("HP:" + this.hp);
    
    if( this.hp <= 0 ) {
        this.isGameOver = true;
        // 物理エンジン停止
        this.physics.pause();
        // プレイヤーを赤色にする
        this.player.setTint(0xff0000);
        // プレイヤーのアニメーション停止
        this.player.anims.stop();
        this.bossJumpTimer.remove();
        this.boneTimer.remove();
        this.boneTimer2.remove();
        // 1秒後にゲームオーバー画面
        this.time.addEvent({
          delay: 1000,
          callback: this.gameOver,
          loop: false,
          callbackScope: this
        });        
    }
};
mainScene3.createBoneGroup2 = function() {
    this.boneGroup2 = this.physics.add.group();
    this.physics.add.collider(this.boneGroup2, this.groundLayer, this.hitBoneAndGround2, null, this);
    this.physics.add.overlap(this.player, this.boneGroup2, this.hitPlayerAndBone2, null, this);
    
    this.boneTimer2 = this.time.addEvent({
        delay: 800,
        callback : this.createBone2,
        loop: true,
        callbackScope: this,
    });
};

mainScene3.createBone2 = function() {
    var x = this.bossEnemy.body.center.x;
    var y = this.bossEnemy.body.center.y;

    var bone = this.boneGroup2.create(x, y, 'bone');
    bone.setAngle(90);
    bone.body.setSize(400, 180);
    bone.setDisplaySize(80, 80);
    bone.setVelocity(-300, -600);
};

mainScene3.hitBoneAndGround2 = function(bone, ground) {
    bone.destroy();
};

mainScene3.hitPlayerAndBone2 = function(player, bone) {
    bone.destroy();
    this.hp--;
    this.cameras.main.flash(500, 255,0,0);
    this.playerHpText.setText("HP:" + this.hp);
    
    if( this.hp <= 0 ) {
        this.isGameOver = true;
        // 物理エンジン停止
        this.physics.pause();
        // プレイヤーを赤色にする
        this.player.setTint(0xff0000);
        // プレイヤーのアニメーション停止
        this.player.anims.stop();
        this.bossJumpTimer.remove();
        this.boneTimer.remove();
        this.boneTimer2.remove();
        // 1秒後にゲームオーバー画面
        this.time.addEvent({
          delay: 1000,
          callback: this.gameOver,
          loop: false,
          callbackScope: this
        });        
    }
};
