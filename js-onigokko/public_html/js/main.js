var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    this.createPlayer();
    this.createUI();
    
    this.createEnemyGroup();
    this.createStarGroup();
};

mainScene.update = function() {
    if(this.isGameOver) {
        return;
    }
    this.movePlayer();
    this.moveEnemy();
};

mainScene.config = function () {
    this.playerSpeed = 5;
    this.enemyMax = 7;
    this.enemyCount = 0;
    
    this.life = 3;
    this.score = 0;
    
    this.isGameOver = false;
};

mainScene.createPlayer = function() {
    this.player = this.physics.add.sprite(400, 300, 'player');
    // スプライト画像のサイズを1.5倍にする
    this.player.setScale(1.5);
    // 最初のフレームを「4」にする
    this.player.setFrame(0);
    this.player.setCollideWorldBounds(true);
    
    // 正面を向く
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });
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
    // 上向きのアニメーション
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    // 下向きのアニメーション
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });        
};

mainScene.movePlayer = function() {
    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.right.isDown) {
        // 右に移動
        this.player.x += this.playerSpeed;
        // 右向きのアニメーション
        this.player.anims.play('right', true);
    } else if(cursors.left.isDown) {
        // 左に移動
        this.player.x -= this.playerSpeed;
        // 左向きのアニメーション
        this.player.anims.play('left', true);
    } else if(cursors.up.isDown) {
        // 上に移動
        this.player.y -= this.playerSpeed;
        // 上向きのアニメーション
        this.player.anims.play('up', true);
    } else if(cursors.down.isDown) {
        // 下に移動
        this.player.y += this.playerSpeed;
        // 下向きのアニメーション
        this.player.anims.play('down', true);
    } else {
        // キーを放すとアニメーション停止
        this.player.anims.stop();
    }
};

mainScene.createUI = function() {
    this.lifeText = this.add.text(30, 20, "Life: " + this.life, {
        font: '24px Open Sans',
        fill: '#ff0000'
    });
    
    this.scoreText = this.add.text(650, 20, "Score: " + this.score, {
        font: '24px Open Sans',
        fill: '#ff0000'
    });
};

mainScene.createEnemyGroup = function() {
    this.enemyGroup = this.physics.add.group();
    this.physics.add.overlap(this.player, this.enemyGroup, this.hitEnemy, null, this);
    
    this.enemyTimer = this.time.addEvent({
        delay : 1000,
        callback : this.createEnemy,
        loop : true,
        callbackScope : this,
    });
};

mainScene.createEnemy = function() {
    if( this.enemyMax <= this.enemyCount ) {
        return;
    }
    var enemyImages = ["enemy001", "enemy002", "enemy003", "enemy004", "enemy005", "enemy006", "enemy007", "enemy008", "enemy009",];
    var enemyImage = Phaser.Math.RND.pick(enemyImages);
    var x = Phaser.Math.RND.between( 50, 750);
    var y = Phaser.Math.RND.between( 50, 550);
    
    var enemy = this.enemyGroup.create(x ,y, enemyImage);
    enemy.setDisplaySize(50, 50);
    enemy.setCollideWorldBounds(true);
    
    enemy.type = Phaser.Math.RND.between(1,3);
    enemy.dx = 2;
    enemy.dy = 2;
    enemy.speed = 2;
    
    this.enemyCount++;
};

mainScene.hitEnemy = function(player, enemy) {
    // プレイヤーと敵が衝突
    if(this.isGameOver) {
        return false;
    }
    
    enemy.destroy();
    this.life--;
    this.enemyCount--;
    
    this.lifeText.setText('Life:' + this.life);
    
    if(this.life <= 0) {
        this.gameOver();
    }
};

mainScene.moveEnemy = function() {
    var enemies = this.enemyGroup.getChildren();
    for(var i in enemies) {
        var enemy = enemies[i];
        switch (enemy.type) {
            case 1 :
                this.horizontalMove(enemy);
                break;
            case 2 :
                this.verticalMove(enemy);
                break;
            case 3 :
                this.chaseMove(enemy);
                break;
        }
    }
};

mainScene.horizontalMove = function(enemy) {
    if( enemy.x > 750 ) {
        enemy.dx = -enemy.dx;
    }
    if( enemy.x < 50 ) {
        enemy.dx = -enemy.dx;
    }
    enemy.x += enemy.dx;
};

mainScene.verticalMove = function(enemy) {
    if( enemy.y > 550 ) {
        enemy.dy = -enemy.dy;
    }
    if( enemy.y < 50 ) {
        enemy.dy = -enemy.dy;
    }
    enemy.y += enemy.dy;
};

mainScene.chaseMove =function(enemy) {
    var playerVector2 = this.player.getCenter();
    var enemyVector2 = enemy.getCenter();
    
    var diff = playerVector2.subtract(enemyVector2).normalize();
    enemy.x += diff.x * enemy.speed;
    enemy.y += diff.y * enemy.speed;
};

mainScene.createStarGroup = function() {
    this.starGroup = this.physics.add.group();
    this.physics.add.overlap(this.player, this.starGroup, this.hitStar, null, this);
    
    this.starTimer = this.time.addEvent({
        delay: 2000,
        callback : this.createStar,
        loop: true,
        callbackScope : this,
    });
};

mainScene.createStar = function() {
    var x = Phaser.Math.RND.between( 50, 750);
    var y = Phaser.Math.RND.between( 50, 550);
    
    var star = this.starGroup.create(x ,y, 'star');
    star.setDisplaySize(50, 50);
    star.setCollideWorldBounds(true);
};

mainScene.hitStar = function(player, star) {
    star.destroy();
    
    this.score += 10;
    this.scoreText.setText("Score:" + this.score);
};

mainScene.gameOver = function() {
    this.isGameOver = true;
    
    this.cameras.main.shake(1000);
    this.cameras.main.on('camerashakecomplete', function(camera, effect) {
        // 赤色にフェードアウトする
        this.cameras.main.fadeOut(1000, 255, 0, 0);
    }, this);

    // フェードアウト完了後に実行する
    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
        // スタートシーンを起動します
        this.scene.start("gameOverScene", {
            score : this.score
        });
    }, this);
};
