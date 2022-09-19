var mainScene2 = new Phaser.Scene("mainScene2");

mainScene2.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // メインシーン
    this.add.text(300, 300, "This is Template",{
        font : "30px Open Sans",
        fill : "#ff0000",
    });
    
    // 背景を設定
    this.background = this.add.tileSprite(0,0, 800, 600, 'background2');
    this.background.setOrigin(0, 0);
    
    // プレイヤーを表示
    this.createPlayer();
    
    // 敵グループを作成
    this.createEnemyGroup();
    
    // ビームを作成
    this.createBeamGroup();
    
    // 敵のビームを作成
    this.createEnemyBeamGroup();
    
    // スコアを表示
    this.createScoreUI();
    
    // プレイヤーのパーティクルを作成
    this.createPlayerParticle();
    
    // HPを表示
    this.createHpUI();
    
    // スコアアップアイテムを作成
    this.createTreasureGroup();
    
    // 回復アイテムを作成
    this.createHeartGroup();
    
    // 防御アイテムを作成
    this.createShieldGroup();
    
    // 一定時間ごとにアイテムを作成
    this.time.addEvent({
        delay: 6000,
        callback: this.chooseItem,
        loop: true,
        callbackScope: this,
    });
    
    // 妨害アイテムを作成
    this.createRockGroup();
    
    // 特殊攻撃アイテムを作成
    this.createThunderGroup();
};

mainScene2.update = function() {
    // 背景をスクロールさせる
    this.background.tilePositionX += 0;
    
    // プレイヤーの移動
    this.movePlayer();
    
    // 画面外の画像を削除
    this.checkRemove();
    
    // スコアが2000を超えらた次のステージに移動
    if(this.score >= 2000) {
        this.scene.start("mainScene3");
    }
};

mainScene2.config = function () {
    // プレイヤーの移動速度
    this.playerSpeed = 200;
    
    // プレイヤーの初期スコア
    this.score = 0;
    
    // ゲームオーバーではない
    this.isGameOver = false;
    
    // プレイヤーの初期HP
    this.hp = 10;
    
    // 防御アイテムの効果 on/off
    this.shieldFlag = false;
    
    // 回転の角度
    this.angle = 0;
    
    // 特殊攻撃の効果 on/off
    this.thunderFlag = false;
};

mainScene2.createPlayer = function() {
    // プレイヤーのスプライト表示
    this.player = this.physics.add.sprite(300, 300, 'player');
    
    // サイズ設定
    this.player.setDisplaySize(50, 50);
    
    // ゲームの空間と衝突
    this.player.setCollideWorldBounds(true);
    
    // キーを放したときに、プレイヤーの移動停止
    this.input.keyboard.on('keyup', function(event) {
        this.player.setVelocity(0,0);
    }, this);
    
    // スーペースキーでビームを発射
    this.input.keyboard.on('keydown-SPACE', function(event) {
        this.shootBeam();
    }, this);
};

mainScene2.movePlayer = function() {
    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.right.isDown) {
        // 右に移動
        this.player.setVelocityX(this.playerSpeed);
    }
    
    if(cursors.left.isDown) {
        // 左に移動
        this.player.setVelocityX(-this.playerSpeed);
    }
    
    if(cursors.up.isDown) {
        // 上に移動
        this.player.setVelocityY(-this.playerSpeed);
    }
    
    if(cursors.down.isDown) {
        // 下に移動
        this.player.setVelocityY(this.playerSpeed);
    }
};

mainScene2.createEnemyGroup = function() {
    // 敵グループを作成
    this.enemyGroup = this.physics.add.group();
    
    // 敵を一定時間ごとに作成
    this.time.addEvent({
        delay: 400,
        callback: this.createEnemy,
        loop: true,
        callbackScope: this,
    });
    
    // プレイヤーと敵グループの衝突処理
    this.physics.add.overlap(this.player, this.enemyGroup, this.hitPlayer1, null, this);
};

mainScene2.createEnemy = function() {
    // Y座標の乱数作成
    var position = Phaser.Math.RND.between(50, 550);
    
    // 敵を作成
    var enemy  = this.enemyGroup.create(750, position, 'enemy');
    
    // 敵のサイズを設定
    enemy.setDisplaySize(50, 50);
    
    // 敵の移動速度の配列を作成
    var speedType = [-200, -150, -100, -50, 0, 50, 100, 150, 200];
    var speedY = Phaser.Math.RND.pick(speedType);
    
    // 敵の移動速度を設定
    enemy.setVelocity(-350, speedY);
    
    // 敵のビームを作成するタイマー処理
    enemy.shootTimer = this.time.addEvent({
        delay: 1000,
        callback: this.shootEnemyBeam,
        loop: false,
        callbackScope: this,
        args: [enemy],
    });
    
    // 敵のパーティクル作成
    this.createEnemyParticle(enemy);
};

mainScene2.createBeamGroup = function() {
    // ビームグループを作成
    this.beamGroup = this.physics.add.group();
    
    // 敵グループとビームグループの衝突処理
    this.physics.add.overlap(this.enemyGroup, this.beamGroup, this.hitBeam, null, this);
};

mainScene2.shootBeam = function() {
    // ビームの初期位置
    var beamX = this.player.x;
    var beamY = this.player.y;
    
    var beamType = 0;
    // ビームの画像
    if(this.thunderFlag == true) {
        // 特殊攻撃時のビームの画像
        beamType = 'S-beam';
    } else {
        // 通常時のビームの画像
        beamType = 'beam';
    }
    
    // ビームの作成
    var beam = this.beamGroup.create(beamX, beamY, beamType);
    
    // ビームのサイズを変更
    if(this.thunderFlag == true) {
        // 特殊攻撃時のビームの大きさ
        beam.setDisplaySize(50, 100);
        
        // 特殊攻撃時のビームの速度
        beam.setVelocityX(600);
        
    } else {
        // 通常時のビームの大きさ
        beam.setDisplaySize(40, 15);
        
        // 通常時のビームの速度
        beam.setVelocityX(400);
    }
};

mainScene2.hitBeam = function(enemy, beam) {
    // 画像を消去
    enemy.shootTimer.remove();
    enemy.destroy();
    
    if(this.thunderFlag == false) {
        beam.destroy();
    }
    // スコアを加算
    this.score += 10;
    
    // UIを更新
    this.scoreText.setText('スコア: ' + this.score);
    
    // 敵のパーティクルを実行
    enemy.emitter.start();
};

mainScene2.createEnemyBeamGroup = function() {
    // 敵ビームグループを作成
    this.enemyBeamGroup = this.physics.add.group();
    
    // プレイヤーとビームグループの衝突処理
    this.physics.add.overlap(this.player, this.enemyBeamGroup, this.hitPlayer2, null, this);
    
    // ビーム同士の衝突処理
    this.physics.add.overlap(this.beamGroup, this.enemyBeamGroup, this.beamCollision, null, this);
};

mainScene2.shootEnemyBeam = function(enemy) {
    // ビームの初期位置
    var enemyX = enemy.x;
    var enemyY = enemy.y;

    // ビームの作成
    var enemyBeam = this.enemyBeamGroup.create(enemyX, enemyY, 'enemyBeam');
    
    // ビームのサイズを変更
    enemyBeam.setDisplaySize(25, 15);
    
    // ビームの速度を設定
    enemyBeam.setVelocityX(-500);
};

mainScene2.beamCollision = function(beam, enemyBeam) {
    if(this.thunderFlag == true) {
        enemyBeam.destroy();
    }
};

mainScene2.createScoreUI = function() {
    // スコアを表示
    this.scoreText = this.add.text(20, 20, 'スコア: ' + this.score, {
        font: '28px Open Sans',
        fill: '#87ceeb'
    });
};

mainScene2.createEnemyParticle = function(enemy) {
    // 敵の爆発パーティクル
    var particles = this.add.particles('bomb');
    enemy.emitter = particles.createEmitter({
        speed: 300,
        maxParticles: 4,
        blendMode: 'ADD',
        follow: enemy,
    });
    // 最初はパーティクルは停止
    enemy.emitter.stop();
};

mainScene2.createPlayerParticle = function() {
    var particles = this.add.particles('bomb');
    this.player.emitter = particles.createEmitter({
        speed: 300,
        maxParticles: 10,
        blendMode: 'ADD',
        follow: this.player,
    });
    // 最初はパーティクルは停止
    this.player.emitter.stop();
};

mainScene2.hitPlayer1 = function(player, enemy) {
    // 防御アイテムが無効なら
    if(this.shieldFlag == false) {
        // プレイヤーと敵が衝突
        if(this.isGameOver) {
            return;
        }
        // HPを減算
        this.hp--;
        
        // HPのUIを更新
        this.hpText.setText('HP: ' + this.hp);
    
    // 防御アイテムが有効なら
    } else if (this.shieldFlag == true) {
        // 防御アイテムを無効にする
        this.shieldFlag = false;
        // 色を元に戻す
        this.player.clearTint();
    }
    
    // 敵を削除
    enemy.destroy();
    
    // HPが０以下なら
    if(this.hp <= 0) {
        // ゲームオーバーにする
        this.isGameOver = true;
        // パーティクル開始
        this.player.emitter.start();
        // プレイヤーを非表示
        this.player.setVisible(false);
        // ゲームオーバー画面を１秒後に表示
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene2.hitPlayer2 = function(player, enemyBeam) {
    // 防御アイテムが無効なら
    if(this.shieldFlag == false) {
        // プレイヤーと敵が衝突
        if(this.isGameOver) {
            return;
        }
        // HPを減算
        this.hp--;
        
        // HPのUIを更新
        this.hpText.setText('HP: ' + this.hp);
    
    // 防御アイテムが有効なら
    } else if(this.shieldFlag == true) {
        // 防御アイテムを無効にする
        this.shieldFlag = false;
        // 色を元に戻す
        this.player.clearTint();
    }
    
    // 敵を削除
    enemyBeam.destroy();
    
    // HPが０以下なら
    if(this.hp <= 0) {
        // ゲームオーバーにする
        this.isGameOver = true;
        // パーティクル開始
        this.player.emitter.start();
        // プレイヤーを非表示
        this.player.setVisible(false);
        // ゲームオーバー画面を１秒後に表示
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};
mainScene2.gameOver = function() {
    // ゲームオーバー画像表示
    this.gameover = this.add.image(400, 300, 'gameover');
    this.gameover.setDisplaySize(500, 500);
    // 何かのキーをクリックするとスタートシーンを開始
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};

mainScene2.createHpUI = function() {
    this.hpText = this.add.text(675, 20, 'HP: ' + this.hp, {
        font: '28px Open Sans',
        fill: '#87ceeb'
    });
};

mainScene2.createTreasureGroup = function() {
    // スコアアップアイテムのグループを作成
    this.treasureGroup = this.physics.add.group();
    
    // プレイヤーと衝突
    this.physics.add.overlap(this.player, this.treasureGroup, this.getTreasure, null, this);
    
    // プレイヤーのビームと衝突
    this.physics.add.overlap(this.beamGroup, this.treasureGroup, this.breakTreasure, null, this);
};

mainScene2.createTreasure = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(50, 550);
    
    // アイテムの作成
    var treasure = this.treasureGroup.create(815, positionY, 'treasure');
    
    // アイテムのサイズを設定
    treasure.setDisplaySize(30, 30);
    
    // アイテムの移動
    treasure.setVelocityX(-200);
    
    // アイテムのパーティクルを作成
    this.createTreasureParticle(treasure);
};

mainScene2.getTreasure = function(player, treasure) {
    // スコアを加算
    this.score += 30;
    
    // UIを更新
    this.scoreText.setText('スコア: ' + this.score);
    
    // 画像を削除
    treasure.destroy();
};

mainScene2.breakTreasure = function(beam, treasure) {
    // 画像を削除
    if(this.thunderFlag == false) {
        beam.destroy();
    }
    
    treasure.destroy();
    
    // パーティクルを実行
    treasure.emitter.start();
};

mainScene2.createTreasureParticle = function(treasure) {
    // パーティクル作成
    var particles = this.add.particles('fragment1');
    treasure.emitter = particles.createEmitter({
        speed: 50,
        maxParticles: 5,
        blendMode: 'ADD',
        follow: treasure,
        scale: { start: 0.05, end: 0.1 }, // 追加してみました
        radial : true, // 追加してみました
        angle : {min: 0, max: 359}, // 追加してみました
    });
    // 最初はパーティクル停止
    treasure.emitter.stop();
};

mainScene2.createHeartGroup = function() {
    // 回復アイテムのグループを作成
    this.heartGroup = this.physics.add.group();
    
    // プレイヤーと衝突
    this.physics.add.overlap(this.player, this.heartGroup, this.getHeart, null, this);
};

mainScene2.createHeart = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(50, 550);
    
    // アイテムの作成
    var heart = this.heartGroup.create(815, positionY, 'heart');
    
    // アイテムのサイズを設定
    heart.setDisplaySize(30, 30);
    
    // アイテムの移動
    heart.setVelocityX(-350);
};

mainScene2.getHeart = function(player, heart) {
    // HPが20未満ならHPを加算
    if(this.hp < 20) {
        this.hp++;
    }
    
    // UIを更新
    this.hpText.setText('HP: ' + this.hp);
    
    // 画像を削除
    heart.destroy();
};

mainScene2.createShieldGroup = function() {
    // 防御アイテムのグループを作成
    this.shieldGroup = this.physics.add.group();
    
    // プレイヤーと衝突
    this.physics.add.overlap(this.player, this.shieldGroup, this.getShield, null, this);
};

mainScene2.createShield = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(50, 550);
    
    // アイテムの作成
    var shield = this.shieldGroup.create(815, positionY, 'shield');
    
    // アイテムのサイズを設定
    shield.setDisplaySize(30, 30);
    
    // アイテムの移動
    shield.setVelocityX(-150);
};

mainScene2.getShield = function(player, shield) {
    // 一回だけ攻撃無効
    this.shieldFlag = true;
    
    // プレイヤーの色を変更
    this.player.setTint(0x0000c0);
    
    // 画像を削除
    shield.destroy();
};

mainScene2.chooseItem = function() {
    // 作成するアイテムの配列
    var items = ['treasure', 'heart', 'shield'];
    
    // 配列の中から一つを選択
    var item = Phaser.Math.RND.pick(items);
    
    // 変数itemで選ばれたアイテムを作成
    if(item == 'treasure') {
        this.createTreasure();
    } else if(item == 'heart') {
        this.createHeart();
    } else if(item == 'shield') {
        this.createShield();
    }
    
};

mainScene2.createRockGroup = function() {
    // グループを作成
    this.rockGroup = this.physics.add.group();
    
    // プレイヤーとの衝突処理
    this.physics.add.overlap(this.player, this.rockGroup, this.hitPlayer3, null, this);
    
    // プレイヤーのビームとの衝突処理
    this.physics.add.overlap(this.beamGroup, this.rockGroup, this.hitRock, null, this);
    
    // 一定時間ごとに画像を作成
    this.time.addEvent({
        delay: 2000,
        callback: this.createRock,
        loop: true,
        callbackScope: this
    });
};

mainScene2.createRock = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(50, 550);
    
    // 画像の種類の配列
    var rocks = ['rock1', 'rock2', 'rock3'];
    
    // 表示するアイテムを選ぶ
    var Srock = Phaser.Math.RND.pick(rocks)
    
    // アイテムの作成
    var rock = this.rockGroup.create(815, positionY, Srock);
    
    // アイテムのサイズを設定
    rock.setDisplaySize(50, 50);
    
    // アイテムの移動
    rock.setVelocityX(-150);
    
    // 重力
    rock.setGravity(0, 200);
    // フワフワ移動のためのタイマー
    rock.timer = this.time.addEvent({
        delay: 900,
        callback: this.rockFloat,
        loop: true,
        callbackScope: this,
        args: [rock],
    });
};

mainScene2.rockFloat = function(rock) {
    rock.setVelocityY(-120);
};

mainScene2.hitPlayer3 = function(player, rock) {
    // 防御アイテムが無効なら
    if(this.shieldFlag == false) {
        // プレイヤーと敵が衝突
        if(this.isGameOver) {
            return;
        }
        // HPを減算
        this.hp--;
        
        // HPのUIを更新
        this.hpText.setText('HP: ' + this.hp);
    
    // 防御アイテムが有効なら
    } else if(this.shieldFlag == true) {
        // 防御アイテムを無効にする
        this.shieldFlag = false;
        // 色を元に戻す
        this.player.clearTint();
    }
    
    // 岩を削除
    rock.timer.remove();
    rock.destroy();
    
    // HPが０以下なら
    if(this.hp <= 0) {
        // ゲームオーバーにする
        this.isGameOver = true;
        // パーティクル開始
        this.player.emitter.start();
        // プレイヤーを非表示
        this.player.setVisible(false);
        // ゲームオーバー画面を１秒後に表示
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene2.hitRock = function(beam, rock) {
    // 画像を削除
    rock.timer.remove();
    
    if(this.thunderFlag == false) {
        beam.destroy();
    }
    rock.destroy();
    
};

mainScene2.createThunderGroup = function() {
    // カミナリグループを作成
    this.thunderGroup = this.physics.add.group();
    
    // 一定時間ごとに画像を作成
    this.time.addEvent({
        delay: 30000,
        callback: this.createThunder,
        loop: true,
        callbackScope: this
    });
    
    // プレイヤーとサンダーの衝突処理
    this.physics.add.overlap(this.player, this.thunderGroup, this.hitThunder, null, this);
};

mainScene2.createThunder = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(50, 550);
    
    // アイテムの作成
    var thunder = this.thunderGroup.create(815, positionY, 'thunder');
    
    // アイテムのサイズを設定
    thunder.setDisplaySize(40, 40);
    
    // アイテムの移動
    thunder.setVelocityX(-400);
};

mainScene2.hitThunder = function(player, thunder) {
    thunder.destroy();
    this.thunderFlag = true;
    this.time.addEvent ({
        delay: 10000,
        callback: this.ReturnFromThunder,
        loop: false,
        callbackScope: this,
    });
};

mainScene2.ReturnFromThunder = function() {
    this.thunderFlag = false;
};

mainScene2.checkRemove = function() {
    // 敵の削除
    var enemies = this.enemyGroup.getChildren();
    for(var a in enemies) {
        if(enemies[a].x < 0) {
            enemies[a].destroy();
            break;
        }
    }
    
    // ビームの削除
    var beams = this.beamGroup.getChildren();
    for(var b in beams) {
        if(beams[b].x > 800) {
            beams[b].destroy();
            break;
        }
    }
    
    // 敵のビームの削除
    var enemyBeams = this.enemyBeamGroup.getChildren();
    for(var c in enemyBeams) {
        if(enemyBeams[c].x < -30) {
            enemyBeams[c].destroy();
            break;
        }
    }
    
    // スコアアップアイテムの削除
    var tres = this.treasureGroup.getChildren();
    for(var d in tres) {
        if(tres[d].x < 0) {
            tres[d].destroy();
            break;
        }
    }
    
    // 回復アイテムの削除
    var hearts = this.heartGroup.getChildren();
    for(var e in hearts) {
        if(hearts[e].x < 0) {
            hearts[e].destroy();
            break;
        }
    }
    
    // 防御アイテムの削除
    var shis = this.shieldGroup.getChildren();
    for(var f in shis) {
        if(shis[f].x < 0) {
            shis[f].destroy();
            break;
        }
    }
    
    // 特殊攻撃アイテムの削除
    var thunders = this.thunderGroup.getChildren();
    for(var g in thunders) {
        if(thunders[g].x < 0) {
            thunders[g].destroy();
            break;
        }
    }
};