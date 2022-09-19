var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // 背景のタイルスプライトを設定
    this.background = this.add.tileSprite(0,0,0,0,'background01');
    this.background.setOrigin(0,0);
    
    // メインシーン
    //this.add.text(300, 300, "This is Template",{
    //    font : "30px Open Sans",
    //    fill : "#ff0000",
    //});
    
    // プレイヤー作成
    this.createPlayer();
    
    // 敵の作成
    this.createEnemyGroup();
    
    // ボール作成
    this.createBallGroup();
    
    // UI作成
    this.createUI();
    
    // アイテム作成
    this.createItemGroup();
};

mainScene.update = function() {
    //背景画像の移動で横スクロールを演出
    this.background.tilePositionX += 1;
    //プレイヤーの移動
    this.movePlayer();
    //敵タイプの配列
    this.enemyType = ["enemy01","enemy02","enemy03"];
    //スコアが30以上ならボスを召喚する
    if( this.score >= 30 && this.isBosscreate == false){
        this.createBoss();
    }
    if( this.isBosscreate == true){
        this.BossMove();
    }
    //if( this.score)
};

mainScene.config = function () {
    // プレイヤーの速度
    this.speed = 200;
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // スコア
    this.score = 0;
    // 連射
    this.burst = false;
    // ボス召喚
    this.isBosscreate = false;
};

mainScene.createPlayer = function() {
    // プレイヤースプライトの表示
    this.player = this.physics.add.sprite(200, 300, 'player');
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(250,100);
    // プレイヤーの最初のフレーム設定
    this.player.setFrame(1);
    // プレイヤーがゲーム空間の領域と衝突
    this.player.setCollideWorldBounds(true);
    // プレイヤー戦闘機のHP
    this.player.hp = 10;
    
    // キーを離したときに、プレイヤー移動停止
    this.input.keyboard.on('keyup',function(event){
        this.player.setVelocity(0,0);
        this.player.setFrame(1);
    },this);
    
    this.input.keyboard.on('keydown-SPACE',function(event){
        if( this.burst == true){
            this.shoot();
            this.time.addEvent({
                delay: 150,
                callback: this.shoot,
                loop: false,
                callbackScope: this,
            });
            this.time.addEvent({
                delay: 300,
                callback: this.shoot,
                loop: false,
                callbackScope: this,
            });
            
        }else if (this.burst == false){
            this.shoot();
        }
    },this);
    
};

mainScene.movePlayer = function() {
    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.right.isDown){
        //右に移動
        this.player.setVelocityX(this.speed);
    }
    if(cursors.left.isDown){
        //左に移動
        this.player.setVelocityX(-this.speed);
    }
    if(cursors.up.isDown){
        //上に移動
        this.player.setVelocityY(-this.speed);
    }
    if(cursors.down.isDown){
        //下に移動
        this.player.setVelocityY(this.speed);
    }
    
};
mainScene.createEnemyGroup = function() {
    // 敵グループの作成
    this.enemyGroup = this.physics.add.group();
    //敵グループとプレイヤーの衝突
    this.physics.add.overlap(this.player,this.enemyGroup,this.hitEnemy,null,this);
    
    this.Enemytimer = this.time.addEvent({
        delay: 1000,
        callback: this.createEnemy,
        loop: true,
        callbackScope: this,
    });
};

mainScene.createEnemy = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(100, 500);
    // 敵をランダムに選択
    var enemyType = Phaser.Math.RND.pick(this.enemyType);
    // 敵の作成
    var enemy = this.enemyGroup.create(700, positionY, enemyType);
    enemy.setDisplaySize(100, 100);
    // 敵の移動速度
    var speedX = Phaser.Math.RND.between(-100, -300);
    var speedY = Phaser.Math.RND.between(200, -200);
    // 敵の移動
    enemy.setVelocity(speedX,speedY);
};

mainScene.hitEnemy = function(player,enemy) {
    if(this.isGameOver){
        return;
    }
    enemy.destroy();
    this.player.hp--;
    this.hpText.setText('HP: ' + this.player.hp);
    if( this.player.hp <= 0 ){
        //ゲームオーバーにする
        this.isGameOver = true;
        //パーティクル開始
        //this.emitter.start();
        //プレイヤーを非表示
        this.player.setVisible(false);
        this.Enemytimer.remove();
        this.Itemtimer.remove();
        this.Beamtimer.remove();
        //ゲームオーバー画面を1秒後に表示
        this.time.addEvent({
           delay: 1000,
           callback: this.Gameover,
           callbackScope: this,
        });
   }
}
    
mainScene.createBallGroup = function() {
    this.ballGroup = this.physics.add.group();
    this.physics.add.overlap(this.ballGroup,this.enemyGroup,this.hitBall,null,this);
}

mainScene.shoot = function() {
    // プレイヤーの位置に設置
    var posX = this.player.x;
    var posY = this.player.y;
    // 弾作成
    var ball = this.ballGroup.create(posX,posY,'ball01');
    ball.setDisplaySize(50, 50);
    // 弾の速度設定
    ball.setVelocityX(300);
}

mainScene.hitBall = function(ball,enemy) {
    ball.destroy();
    enemy.destroy();
    // スコアアップ
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
}

mainScene.createItemGroup = function() {
    // アイテムグループの作成
    this.itemGroup = this.physics.add.group();
    // アイテムグループとプレイヤーの衝突
    this.physics.add.overlap(this.player,this.itemGroup,this.hitItem,null,this);
    
    this.Itemtimer = this.time.addEvent({
        delay: 10000,
        callback: this.createItem,
        loop: true,
        callbackScope: this,
    });
}

mainScene.createItem = function() {
    // Y座標の乱数作成
    var positionY = Phaser.Math.RND.between(100, 500);
    // アイテムの作成
    var item = this.itemGroup.create(700,positionY,"item01");
    item.body.setSize(20,20);
    item.setDisplaySize(200,200);
    // アイテムの移動速度
    var speedX = -300;
    // アイテムの移動
    item.setVelocityX(speedX);
    
}

mainScene.hitItem = function(player,item) {
    item.destroy();
    var itemType = Phaser.Math.RND.between(1, 3);
    if(itemType == 1){
        this.player.hp += 3;
        this.hpText.setText('HP: ' + this.player.hp);
    } else if(itemType == 2){
        this.score += 3;
        this.scoreText.setText('Score: ' + this.score);
    } else if(itemType == 3){
        this.burst = true;
        this.burstText.setText('連射: ' + this.burst);
        this.time.addEvent({
            delay: 3000,
            callback: this.burstoff,
            loop: false,
            callbackScope: this,
        });
    }
}

mainScene.burstoff = function(){
    this.burst = false;
    this.burstText.setText('連射: ' + this.burst);
}

mainScene.createBoss = function(){
    this.boss = this.physics.add.image(700,300,'enemy04');
    this.boss.setDisplaySize(150,150);
    this.boss.hp = 50;
    this.boss.dy = 3;
    this.isBosscreate = true;
    this.physics.add.overlap(this.boss,this.ballGroup,this.hitBoss,null,this);
    
    this.beamGroup = this.physics.add.group();
    this.physics.add.overlap(this.player,this.beamGroup,this.hitBeam,null,this);
    
    if( this.isBosscreate ==  true){
        this.Beamtimer = this.time.addEvent({
            delay: 1500,
            callback: this.BossAttack,
            loop: true,
            callbackScope: this,
        });
    }
}

mainScene.BossMove = function(){
    if(this.boss.y >= 525){
        this.boss.dy = -this.boss.dy;
    }
    if(this.boss.y <= 75){
        this.boss.dy = -this.boss.dy;
    }
    this.boss.y += this.boss.dy;
}

mainScene.hitBoss = function(boss,ball){
    ball.destroy();
    this.boss.hp--;
    if( this.boss.hp <= 0 ){
        this.boss.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);;
        this.Enemytimer.remove();
        this.Itemtimer.remove();
        this.Beamtimer.remove();
        this.time.addEvent({
            delay: 1000,
            callback: this.Gamecrear,
            callbackScope: this,
        });
    }
}

mainScene.BossAttack = function() {
    // プレイヤーの位置に設置
    var posX = this.boss.x;
    var posY = this.boss.y;
    // 弾作成
    var beam = this.beamGroup.create(posX,posY,'beam01');
    beam.setDisplaySize(50, 50);
    // 弾の速度設定
    beam.setVelocityX(-300);
}

mainScene.hitBeam = function(player,beam){
    if(this.isGameOver){
        return;
    }
    beam.destroy();
    this.player.hp--;
    this.hpText.setText('HP: ' + this.player.hp);
    if( this.player.hp <= 0 ){
        //ゲームオーバーにする
        this.isGameOver = true;
        //パーティクル開始
        //this.emitter.start();
        //プレイヤーを非表示
        this.player.setVisible(false);
        this.Enemytimer.remove();
        this.Itemtimer.remove();
        this.Beamtimer.remove();
        //ゲームオーバー画面を1秒後に表示
        this.time.addEvent({
            delay: 1000,
            callback: this.Gameover,
            callbackScope: this,
        });
   }
}


mainScene.Gameover = function() {
    // ゲームオーバー画像表示
    this.gameoverimage = this.add.image(400,300,'gameover');
    this.gameoverimage.setDisplaySize(500,500);
    this.input.keyboard.on('keydown',function(event) {
        this.scene.start("startScene");
    },this);
}

mainScene.Gamecrear = function() {
    this.gamecrearimage = this.add.image(400,300,'gameover');
    this.gamecrearimage.setDisplaySize(500,500);
    this.input.keyboard.on('keydown',function(event) {
        this.scene.start("startScene");
    },this);
    
}

mainScene.createUI = function() {
    // HPを文字で表示する
    this.hpText = this.add.text(650,50,'HP:' + this.player.hp,{
        font: '28px Open Sans',
        fill: '#0000FF'
    });
    // スコアを文字で表示する
    this.scoreText = this.add.text(650,20,'Score:' + this.score,{
        font: '28px Open Sans',
        fill: '#ff0000'
    });
    // バーストの状態を文字で表示する
    this.burstText = this.add.text(650,80,'連射:' + this.burst,{
        font: '28px Open Sans',
        fill: '#008000'
    });
};
