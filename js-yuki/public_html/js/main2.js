var mainScene2 = new Phaser.Scene("mainScene2");

mainScene2.create = function (data) {
    // 初期設定
    this.config(data);
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#a89e8f');
    
    // マップ表示
    this.createMap();
    
    // プレイヤー作成
    this.createPlayer();
    
    // UI作成
    this.createUI();
    
    // スター作成
    this.createStarGroup();
    
    // 敵作成
    this.createEnemyGroup();
    
    // ボール作成
    this.createBallGroup();

    // スペースキーでボール発射
    this.input.keyboard.on('keydown-SPACE', function(event) {
        this.shoot();
    }, this);

    this.createGoalZone();
};

mainScene2.update = function() {
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
};


// 初期設定
mainScene2.config = function(data) {
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
    
    this.score = data.score;
    this.hp = data.hp;
};

mainScene2.createMap = function() {
    // マップ表示
    // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
    this.map = this.make.tilemap({key: 'map02'});

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

mainScene2.createPlayer = function() {
    // プレイヤー作成
    this.player = this.physics.add.sprite(50, 500, 'player');
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


mainScene2.createUI = function() {
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

mainScene2.createStarGroup = function() {
    // スターグループ作成
    this.starGroup = this.physics.add.group();
    // スターグループと地面の衝突
    this.physics.add.collider(this.starGroup, this.groundLayer);
    // スター作成
    this.createStar();
    // 3秒ごとにスターを作成
    this.starTimer = this.timeEvent = this.time.addEvent({
      delay: 3000,
      callback: this.createStar,
      loop: true,
      callbackScope: this
    });
    // プレイヤーとスターの衝突
    this.physics.add.overlap(this.player, this.starGroup, this.hitStar, null, this);
};

mainScene2.createStar = function() {
    // スターの作成
    var starPositionX = Phaser.Math.RND.between(200, 1200);
    var starPositionY = Phaser.Math.RND.between(70, 840);
    // スターの作成
    var star = this.starGroup.create(starPositionX, starPositionY, 'star');
    // スターの衝突サイズ設定
    star.body.setSize(65,65);
    // スターの表示サイズ設定
    star.setDisplaySize(70, 70);
    // バウンス設定
    star.setBounce(0.5);
};

mainScene2.hitStar = function(player, star) {
    // プレイヤーとスターの衝突
    star.destroy();
    // スコアアップ
    this.score += 10;
    var scoreText = 'スコア：' + this.score;
    this.text.setText(scoreText);
};

mainScene2.createEnemyGroup = function() {
    // 敵グループ作成
    this.enemyGroup = this.physics.add.group();
    // 最初の敵の作成
    this.createEnemy();
    // 敵は地面と衝突する
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    // 敵はプレイヤーと衝突する
    this.physics.add.overlap(this.enemyGroup, this.player, this.hitEnemy, null, this);
    // 2秒ごとに、新しい敵を作成する
    this.enemyTimer = this.timeEvent = this.time.addEvent({
      delay: 2000,
      callback: this.createEnemy,
      loop: true,
      callbackScope: this
    });
};

mainScene2.createEnemy = function() {
    // 敵の作成
    // 作成する敵の種類をランダムにする
    var enemyType = Phaser.Math.RND.pick(this.enemyData);
    // 敵の初期位置をランダムにする
    var enemyPositionX = Phaser.Math.RND.between(200, 70 * 40);
    // 敵作成
    var enemy = this.enemyGroup.create(enemyPositionX, 70, enemyType);
    enemy.body.setSize(350,350);
    enemy.setDisplaySize(70, 70);
    // 敵の移動速度をランダムに決定する
    var speed = Phaser.Math.RND.pick(this.enemySpeed);
    enemy.setVelocityX(speed);
};

mainScene2.hitEnemy = function(player, enemy) {
    // プレイヤーと敵の衝突
    // ゲームオーバーにして、updateの動作停止
    this.isGameOver = true;
    // HP減算
    this.hp--;
    this.playerHpText.setText("HP:" + this.hp);
    // 物理エンジン停止
    this.physics.pause();
    // プレイヤーを赤色にする
    this.player.setTint(0xff0000);
    // プレイヤーのアニメーション停止
    this.player.anims.stop();
    if(this.hp <= 0) {
        // スター作成停止
        this.starTimer.remove();
        // 敵作成停止
        this.enemyTimer.remove();
        // 1秒後にゲームオーバー画面
        this.time.addEvent({
          delay: 1000,
          callback: this.gameOver,
          loop: false,
          callbackScope: this
        });        
    } else {
        this.time.addEvent({
          delay: 2000,
          callback: this.gameRestart,
          loop: false,
          callbackScope: this
        });        
        
    }
};

mainScene2.gameOver = function() {
    // ゲームオーバー処理
    // 現在のカメラの中心座標を取得
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    // ゲームオーバー画像を画面中央に表示
    var gameoverImage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    gameoverImage.setDisplaySize(500,400);
    // 何かキーをクリックするとゲーム再開
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('mainScene');
    }, this);
};

mainScene2.gameRestart = function() {
    this.isGameOver = false;
    this.player.setPosition(50, 100);
    this.physics.resume();
    this.player.clearTint();
    this.player.anims.resume();
    this.player.setFrame(7);
};

mainScene2.createBallGroup = function() {
    // ボールグループ作成
    this.ballGroup = this.physics.add.group();
    // ボールグループと地面の衝突
    this.physics.add.collider(this.ballGroup, this.groundLayer, this.hitBallAndGround, null, this);    
    // ボールグループと敵の衝突
    this.physics.add.overlap(this.ballGroup, this.enemyGroup, this.hitBall, null, this);
};

mainScene2.shoot = function() {
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
mainScene2.hitBallAndGround = function(ball, ground) {
    ball.destroy();
};

mainScene2.hitBall = function(ball, enemy) {
    // ボールと敵の衝突
    // 敵の削除
    enemy.destroy();
    // ボールの削除
    ball.destroy();
    // スコアアップ
    this.score += 1;
    var scoreText = 'スコア：' + this.score;
    this.text.setText(scoreText);
};

mainScene2.createGoalZone = function() {
    this.goalZone = this.add.zone(70 * 50, 70 * 10, 70, 70 * 2);
    this.physics.add.existing(this.goalZone);
    this.goalZone.body.setAllowGravity(false);
    this.physics.add.overlap(this.player, this.goalZone, this.reachGoal, null, this);
};

mainScene2.reachGoal = function() {
    this.isGameOver = true;
    this.physics.pause();
    this.player.anims.stop();
    
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    // フェードアウト完了後に実行する
    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
        // スタートシーンを起動します
        this.scene.start("mainScene3",{
            hp : this.hp,
            score : this.score,
        });
    }, this);
};
