var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
        
    this.createMap();

    //プレイヤー
    this.createPlayer();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#000050');
    
    //移動する床
    this.createfloorMove();
    
    //棘
    this.createthorn();
    
    //テキスト
    this.createUI();
    
    //ジャンプブロック
    this.createjumpblock();
    
    //インセクト
    this.createinsect();
    
    //チェイス
    this.createChase();
    
    //クリアアイテム
    this.createClearitem();
    
    
    //鋭い棘
    this.createSpine();
    
};


mainScene.update = function() {
    if( this.isgameOver == true ) {
        if( this.gameoverimage != undefined ) {
            if( this.gameoverimage.displayWidth < 500 ) {
                this.gameoverimage.displayWidth += this.gameoverimage.dx;
                this.gameoverimage.displayHeight += this.gameoverimage.dy;
            }
        }
        return;
    }
    
    if( this.Floor == 1 || this.Floor == 2 ) {
        this.moveplayer();
    }else if( this.Floor == 3 ){
        this.moveplayer3();
        

    } 

    
    if( this.floorMove.x < 800 ) {
        this.dx = -this.dx;
    }
    
    if( this.floorMove.x > 1000 ) {
        this.dx = -this.dx;
    }
    
    this.floorMove.x += this.dx;
    
    if( this.insect.x > 1520 ) {
        this.insect.dx = -this.insect.dx;
    }
    
    if( this.insect.x < 1440 ) {
        this.insect.dx = -this.insect.dx;
    }
    
    this.insect.x += this.insect.dx;
    
    if( this.insect2.y > 944 ) {
        this.insect2.dy = -this.insect2.dy;
    }
    
    if( this.insect2.y < 1072 ) {
        this.insect2.dy = -this.insect2.dy;
    }
    
    this.insect2.y += this.insect2.dy;
    
    
    if( this.chase.moving == true ) {
        this.chase.x += this.chase.dx;
    }
    
    if( this.chase2 != undefined && this.chase2.moving == true ) {
        this.chase2.x += this.chase2.dx;
    }
    
    if( this.insect3.y > 784 ) {
        this.insect3.dy = this.insect3.dy;
    }
    
    if( this.insect3.y < 816 ) {
        this.insect3.dy = -this.insect3.dy;
    }
    this.insect3.y += this.insect2.dy; 

};

mainScene.config = function () {
 // カーソルを取得する
    this.cursors = this.input.keyboard.createCursorKeys();    
    // プレイヤーの動く速度
    this.runSpeed = 200;
    // プレイヤーのジャンプパワー
    this.jumpPower = 325;
    
    this.dx = 1.2;
    
    this.HP = 5;
    
    this.angle = 0; 
    
    this.Floor = 1;
    
    this.isgameOver = false;
    
    this.count = 45;
    
    
};

mainScene.createMap = function() {
    // マップ表示
    //JSON形式のマップデータの読み込み　Tilemapオブジェクトの作成
    this.map = this.make.tilemap({key: 'map1'});　　　　　　　
    
    const layerWidth = 16 * 2 * 70;
    const layerHeight = 16 * 2 * 35;
    
    //タイル画像をマップデータに反映する　tilemapオブジェクトの作成
    var groundTiles = this.map.addTilesetImage('tile1');
    //地面レイヤー作成　DynamicTilemapLayerオブジェクト作成
    this.groundLayer = this.map.createDynamicLayer('ground', groundTiles, 0, 0);
    //衝突判定から除外したいタイルのインデックスを配列で指定する
    //「-1」は空のタイルなので衝突しない。それ以外は衝突する
    this.groundLayer.setCollisionByExclusion([-1]);
    this.groundLayer.setDisplaySize(layerWidth, layerHeight);
    
    //ゲームワールドの幅と高さの設定
    this.physics.world.bounds.width = this.groundLayer.displayWidth;
    this.physics.world.bounds.height = this.groundLayer.displayHeight;
    
    //カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    //カメラの初期位置は左下にする
    this.cameras.main.centerOn(50, 850);
    
};

mainScene.createUI = function() {
    this.HPText = this.add.text(650, 100, 'HP:' + this.HP, {
        font: '20px Open sans',
        fill: '#0eb680'
    });
    
    this.HPText.setScrollFactor(0);

};

mainScene.createPlayer = function() {
    // プレイヤー作成
    this.player = this.physics.add.sprite(50, 900, 'player');
    // 衝突サイズの調整
    // 表示サイズを変更する前に、物理エンジンでの判定サイズの変更
    this.player.body.setSize(70,100);
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(45,45 );
    // プレイヤーの最初の向きは右
    this.player.setFrame(1);
    this.player.direction = 'right';
    // プレイヤーの衝突時のバウンス設定
    this.player.setBounce(0);
    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.player.setCollideWorldBounds(true);
    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.groundLayer);
    //ビーム発射
    this.input.keyboard.on('keydown-SPACE', function(event) {
       // this.createBeam();
    },this);
    
    // 左向きのアニメーション
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 25, end: 26 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 25, end: 26 }),
        frameRate: 10,
        repeat: -1
    });

    //カメラはプレイヤーを追跡する。プレイヤーの移動に合わせて、カメラが移動する
    this.cameras.main.startFollow(this.player);
    
    // 何かのキーをはなすとプレイヤーの横移動が停止
    this.input.keyboard.on('keyup', function(event) {
        this.player.setVelocityX(0);
    }, this);
    
    // プレイヤー用回転アニメーション
    this.rotateTween = this.tweens.add({
        // 対象オブジェクト
        targets: this.player,
        // アニメーションの動き
        ease: 'Power0',
        // 実行時間
        duration: 700,
        // 遅延
        delay: 200,
        // 繰り返し回数
        repeat: 0,
        // 回転角度
        angle: -360,
    });
    // 回転アニメーションは最初は停止
    this.rotateTween.pause();
};

mainScene.moveplayer = function() {
    // プレイヤーの操作処理
    if( this.cursors.left.isDown) {
        //左カーソルクリック
        this.player.setVelocityX(-this.runSpeed);
        this.player.anims.play('left', true);
        this.player.direction = 'left';
        this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
        //右カーソルクリック
        this.player.setVelocityX(this.runSpeed);
        this.player.anims.play('right', true);
        this.player.direction = 'right';
        this.player.setFlipX(false);
    } else if ( this.cursors.up.isDown) {
        this.player.setVelocityY( -this.runSpeed);
    } else{
        //キーを離したとき
        this.player.setVelocityX(0);
        this.player.anims.stop();
    }
    //上カーソルキーをクリックした時にジャンプ
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-this.jumpPower);

    }
};


mainScene.moveplayer3 = function() {
    // プレイヤーの操作処理
    if( this.cursors.left.isDown) {
        //左カーソルクリック
        this.player.setVelocityX(-this.runSpeed);
        this.player.anims.play('left', true);
        this.player.direction = 'left';
        this.player.setFlipX(true);
        
    } else if (this.cursors.right.isDown) {
        //右カーソルクリック
        this.player.setVelocityX(this.runSpeed);
        this.player.anims.play('right', true);
        this.player.direction = 'right';
        this.player.setFlipX(false);
        
    } else if ( this.cursors.up.isDown) {
        this.player.setVelocityY( -this.runSpeed);
        this.player.anims.play('up', true);
        this.player.direction = 'up';


    } else if( this.cursors.down.isDown ){ 
        this.player.setVelocityY( this.runSpeed);
        this.player.anims.play('down', true);
        this.player.direction = 'down';
    } else {
        //キーを離したとき
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.anims.stop();
    }

};
mainScene.createfloorMove = function() {
    this.floorMove = this.physics.add.sprite(900, 1009, 'tile1');
    this.physics.add.collider(this.player, this.floorMove,this.hitFloor, null, this );
    
    this.floorMove.setFrame(45);
    this.floorMove.setDisplaySize(64,32);
    this.floorMove.setImmovable(true);
    this.floorMove.body.setAllowGravity(false);

    
};

mainScene.hitFloor = function(player, floorMove) {
    if(this.player.body.touching.down && this.floorMove.body.touching.up) {
        this.player.x += this.dx;
    }
};

mainScene.createthorn = function() {
    this.thorn = this.physics.add.sprite(432, 1104, 'tile1');
    this.thorn.setFrame(122);
    this.thorn.setDisplaySize(32,32);
    this.thorn.setImmovable(true);
    this.thorn.body.setAllowGravity(false);
    
    this.thorn2 = this.physics.add.sprite(464, 1104, 'tile1');
    this.thorn2.setFrame(122);
    this.thorn2.setDisplaySize(32,32);
    this.thorn2.setImmovable(true);
    this.thorn2.body.setAllowGravity(false);
    
    this.thorn3 = this.physics.add.sprite(1264, 1072, 'tile1');
    this.thorn3.setFrame(122);
    this.thorn3.setDisplaySize(32,32);
    this.thorn3.setImmovable(true);
    this.thorn3.body.setAllowGravity(false);
    
    this.thorn4 = this.physics.add.sprite(1328, 1072, 'tile1');
    this.thorn4.setFrame(122);
    this.thorn4.setDisplaySize(32,32);
    this.thorn4.setImmovable(true);
    this.thorn4.body.setAllowGravity(false);    
    
    this.physics.add.collider(this.player, this.thorn, this.hitthorn, null, this);
    this.physics.add.collider(this.player, this.thorn2, this.hitthorn, null, this);
    this.physics.add.collider(this.player, this.thorn3, this.hitthorn, null, this);
    this.physics.add.collider(this.player, this.thorn4, this.hitthorn, null, this);

};

mainScene.hitthorn = function() {
    this.HP -= 1; 
    this.HPText.setText( "HP:" + this.HP ); 
    this.cameras.main.flash(800, 200, 0, 0);
    this.player.setVelocityY(-350);
    this.rotateTween.play();
};

mainScene.createjumpblock = function() {
    var x = 32 * 37 + 16;
    var y = 32 * 32 + 16;
    this.jumpblock = this.physics.add.sprite(x, y, 'tile1');
    this.jumpblock.setFrame(201);
    this.jumpblock.setDisplaySize(32,32);
    this.jumpblock.setImmovable(true);
    this.jumpblock.body.setAllowGravity(false);
    
    this.physics.add.collider(this.player, this.jumpblock, this.hitjumpblock, null, this);
};

mainScene.hitjumpblock = function(player, jumpblock) {
    if( this.player.body.touching.down && this.jumpblock.body.touching.up ) {
        //this.player.setVelocity(-300);
        this.player.setVelocity(100, -300);
    }
};

mainScene.createinsect = function() {
    var x = 47 * 32 + 16;
    var y = 32 * 32 + 16;
   
    this.insect = this.physics.add.sprite(x,y, 'tile1');
    this.insect.setFrame(281);
    this.insect.setDisplaySize(32,32);
    this.insect.setImmovable(true);
    this.insect.body.setAllowGravity(false);
    this.insect.dx = 1.3;
    this.insect.isHit = false;

    this.physics.add.collider(this.player, this.insect, this.hitinsect, null, this);
    
    this.insect2 = this.physics.add.sprite(1712, 1008, 'tile1');
    this.insect2.setFrame(281);
    this.insect2.setDisplaySize(32,32);
    this.insect2.setImmovable(true);
    this.insect2.body.setAllowGravity(false);
    this.insect2.dy = 1.3;
    this.insect2.isHit = false;

    this.physics.add.collider(this.player, this.insect2, this.hitinsect2, null, this);
    
    var x = 35 * 32 + 16
    var y = 25 * 32 + 16
    this.insect3 = this.physics.add.sprite(x, y, 'tile1');
    this.insect3.setFrame(281);
    this.insect3.setDisplaySize(32,32);
    this.insect3.setImmovable(true);
    this.insect3.body.setAllowGravity(false);
    this.insect3.dy = 1.3;
    this.insect3.isHit = false;

    this.physics.add.collider(this.player, this.insect3, this.hitinsect, null, this);    


    
};

mainScene.hitinsect = function(player, insect) {
    if ( this.insect.isHit ) {
        return;
    }
    
    this.HP -= 1;
    this.cameras.main.flash(800, 200, 0, 0);
    this.HPText.setText( "HP:" + this.HP ); 
    this.insect.isHit = true;
    
    // タイマーでisHitを解除する仕組み
    this.time.addEvent({
        delay: 3000,
        callback : this.setInsectIsHit,
        loop: false,
        callbackScope: this
    });
};

mainScene.setInsectIsHit = function() {
    this.insect.isHit = false;
};


mainScene.hitinsect2 = function(player, insect2) {
    if ( this.insect2.isHit ) {
        return;
    }
    
    this.HP -= 1;
    this.cameras.main.flash(800, 200, 0, 0);
    this.HPText.setText( "HP:" + this.HP ); 
    this.insect2.isHit = true;
    
    // タイマーでisHitを解除する仕組み
    this.time.addEvent({
        delay: 3000,
        callback : this.setInsect2IsHit,
        loop: false,
        callbackScope: this
    });
};

mainScene.setInsect2IsHit = function() {
    this.insect2.isHit = false;
};

mainScene.createChase = function() {
    var y = 30.5 * 32 + 16;
    this.chase = this.physics.add.sprite(16, y, 'tile1');
    this.chase.setFrame(325);
    this.chase.setDisplaySize(16, 192);
    this.chase.setImmovable(true);
    this.chase.body.setAllowGravity(false);
    this.chase.dx = 2.62;
    
    this.chase.moving = false;
    this.chasestop();
    
    this.physics.add.collider( this.player, this.chase, this.hitchase, null, this );
    
    if( this.chase.x == 2224 ) {
        this.chase.setPosition(80, 688);
    }
    

};

mainScene.hitchase = function(player, chase) {
    this.cameras.main.shake(1000);
    this.cameras.main.flash(800, 200, 0, 0);
    this.creategameover();
};


mainScene.chasestop = function(chase) {
    
    this.time.addEvent({
        delay: 3000,
        callback: this.ct,
        loop: false,
        callbackScope: this
    });
};

mainScene.ct = function() {
    this.chase.moving = true;
};

mainScene.createClearitem = function() {
    
    var x = 67 * 32 + 16;
    var y = 30 * 32 + 16;
    this.clearitem = this.physics.add.sprite(x, y, 'tile1');
    
    this.clearitem.setDisplaySize( 32, 32 );
    this.clearitem.setFrame(43);
    this.clearitem.body.setAllowGravity(false);
    this.clearitem.setImmovable(true);
    
    this.physics.add.overlap(this.player, this.clearitem, this.hitclearitem, null, this);
    
    var x2 = 63 * 32 + 16;
    var y2 = 22 * 32 + 16;
    this.clearitem2 = this.physics.add.sprite(x2, y2, 'tile1');
    
    this.clearitem2.setDisplaySize( 32, 32 );
    this.clearitem2.setFrame(43);
    this.clearitem2.body.setAllowGravity(false);
    this.clearitem2.setImmovable(true);
    
    this.physics.add.overlap( this.player, this.clearitem2, this.hitclearitem2, null, this);
    
    

};

mainScene.hitclearitem = function(player, clearitem) {

    this.player.setPosition(50, 784);
    this.createChase2();
    
    this.Floor = 2;
};

mainScene.hitclearitem2 = function(clearitem2) {
    
    this.createPlayer2();
    this.Floor = 3;
    this.createChaseGroupX();
    this.countdowntime();
    
    
    
};

mainScene.createSpine = function() {
    this.spineGroup = this.physics.add.group();

    var positions = [
        [400, 848],
        [432, 848],
        [464, 848],
        [496, 848],
        [528, 848],
        [560, 848],
        [592, 848],
        [624, 848],
        [656, 848],
        [688, 848],
        [720, 848],
    ];
    
    for(var i = 0; i < positions.length; i++) {
        var spine = this.spineGroup.create(0, 0, 'tile1');
        spine.setFrame(122);
        spine.setDisplaySize( 32, 32 );
        spine.body.setAllowGravity( false );
        spine.setImmovable( true );
        spine.setPosition( positions[i][0], positions[i][1] );
    }

    this.physics.add.collider( this.player, this.spineGroup, this.hitspine, null, this);

    
};

mainScene.hitspine = function(player, spine) {
    this.HP -= 1; 
    this.HPText.setText( "HP:" + this.HP ); 
    this.cameras.main.flash(800, 200, 0, 0);
    this.player.setVelocityY(-350);
    // 回転アニメーション実行
    this.rotateTween.play();
}; 

mainScene.createChase2 = function() {
    var y = 22.5 * 32 + 16;
    this.chase2 = this.physics.add.sprite(16, y, 'tile1');
    this.chase2.setFrame(325);
    this.chase2.setDisplaySize(16, 256);
    this.chase2.setImmovable(true);
    this.chase2.body.setAllowGravity(false);
    this.chase2.dx = 2.68;
    
    this.chase2.moving = false;
    this.chasestop2();
    
    this.physics.add.collider( this.player, this.chase2, this.hitchase2, null, this );
    
};

mainScene.chasestop2 = function() {
    
    this.time.addEvent({
        delay: 3000,
        callback: this.ct2,
        loop: false,
        callbackScope: this
    });
    
};

mainScene.ct2 = function() {
    this.chase2.moving = true;
};

mainScene.hitchase2 = function(player, chase) {
    this.cameras.main.shake(1000);
    this.cameras.main.flash(800, 200, 0, 0);
    this.creategameover();
};

mainScene.createPlayer2 = function(player2) {
    var x = 30 * 32 + 16;
    var y = 9 * 32 + 16;
    this.player.setPosition(x, y);


    // プレイヤーの最初の向きは前
    this.player.setFrame(10);
    this.player.direction = 'right';
    
    this.player.body.setAllowGravity( false );

    // 左向きのアニメーション
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 25, end: 26 }),
        frameRate: 10,
        repeat: -1
    });
    // 右向きのアニメーション
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 25, end: 26 }),
        frameRate: 10,
        repeat: -1
    });
    //前向きのアニメーション
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    //後ろ向きのアニメーション
    this.anims.create({
        key:'down',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6  }), // or 36 - 39
        frameRate: 10,
        repeat: -1
    });

};


mainScene.createChaseGroupX = function() {
    this.chaseGroupX = this.physics.add.group();
    this.physics.add.overlap(this.chaseGroupX, this.player, this.hitchaseGroupX, null, this);
    this.time.addEvent({
        delay:3000,
        callback:this.createchaseX,
        loop:false,
        callbackScope:this,
    });
    
    this.time.addEvent({
        delay:3000,
        callback:this.createchaseX2,
        loop:false,
        callbackScope:this,
    });
    this.time.addEvent({
        delay:3000,
        callback:this.createchaseY,
        loop:false,
        callbackScope:this,
    });

    this.time.addEvent({
        delay:3000,
        callback:this.createchaseY2,
        loop:false,
        callbackScope:this,
    });
    
};

mainScene.createchaseX = function() {
    var chase = this.chaseGroupX.create(0, 0, 'tile1');
    
    //chase.setRandomPosition(左上のX座標,左上のY座標,右下のX座標,右下のY座標);
    chase.setRandomPosition(700, 16, 0, 496);
    var size = Phaser.Math.RND.between(96 ,192);
    
    chase.setDisplaySize(32,size);
    chase.setFrame(325);
    chase.dx = [1, 1.5,1.75, 2, 3];
    chase.setImmovable( true);
    chase.body.setAllowGravity( false );
    // 加速の乱数作成
    var a = Phaser.Math.RND.between(190, 300);
    // 加速
    chase.setVelocityX(a);
    
    var randomtime = Phaser.Math.RND.between(2000, 4500);
    this.time.addEvent({
        delay:randomtime,
        callback:this.createchaseX,
        loop:false,
        callbackScope:this,
    });
};

mainScene.createchaseX2 = function() {
    var chase = this.chaseGroupX.create(0, 0, 'tile1');
    
    //chase.setRandomPosition(左上のX座標,左上のY座標,右下のX座標,右下のY座標);
    chase.setRandomPosition(1583, 16, 0, 496);
    var size = Phaser.Math.RND.between(96 ,192);

    chase.setDisplaySize(32, size);
    chase.setFrame(325);
    chase.dx = [1, 1.5,1.75, 2, 3];
    chase.setImmovable( true);
    chase.body.setAllowGravity( false );
    
    var a = Phaser.Math.RND.between(-300, -170);
    
    chase.setVelocityX(a);    
    
    var randomtime = Phaser.Math.RND.between(2000, 4500);
    this.time.addEvent({
        delay:randomtime,
        callback:this.createchaseX2,
        loop:false,
        callbackScope:this,
    });
};

mainScene.createchaseY = function() {
    var chase = this.chaseGroupX.create(0, 0, 'tile1');
    
    //chase.setRandomPosition(左上のX座標,左上のY座標,右下のX座標,右下のY座標);
    chase.setRandomPosition(0, 0, 1584, 0);
    var size = Phaser.Math.RND.between(64 ,160);
    
    chase.setDisplaySize(size,32);
    chase.setFrame(325);
    chase.dx = [1, 1.5,1.75, 2, 3];
    chase.setImmovable( true);
    chase.body.setAllowGravity( false );
    
    var a = Phaser.Math.RND.between(170, 300);
    
    chase.setVelocityY(a);    
    
    var randomtime = Phaser.Math.RND.between(2000, 4500);
    this.time.addEvent({
        delay:randomtime,
        callback:this.createchaseY,
        loop:false,
        callbackScope:this,
    });
};

mainScene.createchaseY2 = function() {
    var chase = this.chaseGroupX.create(0, 0, 'tile1');
    
    //chase.setRandomPosition(左上のX座標,左上のY座標,右下のX座標,右下のY座標);
    chase.setRandomPosition(0, 528, 1584, 528);
    var size = Phaser.Math.RND.between(64 ,160);
    
    chase.setDisplaySize(size,32);
    chase.setFrame(325);
    chase.dx = [1, 1.5,1.75, 2, 3];
    chase.setImmovable( true);
    chase.body.setAllowGravity( false );
    
    var a = Phaser.Math.RND.between(-300, -170);
    
    chase.setVelocityY(a); 
    
    var randomtime = Phaser.Math.RND.between(2000, 4500);
    this.time.addEvent({
        delay:randomtime,
        callback:this.createchaseY2,
        loop:false,
        callbackScope:this,
    });

};

mainScene.hitchaseGroupX = function(player, chase) {
    
    this.cameras.main.flash(800, 200, 0, 0);
    this.cameras.main.shake(1000);
    this.HP -= 2;
    if( this.HP <= 0 ) {
        this.HP = 0;
    }
    
    this.HPText.setText( "HP:" + this.HP ); 
    chase.destroy();
    if( this.HP <= 0 ) {
        this.creategameover();
    }

};

mainScene.creategameover = function() {
    // 物理エンジンを停止
    this.physics.pause();
    // UPDATEメソッドの停止
    this.isgameOver = true;
    // いろいろなタイマーの停止
    //this.time.pause();
    // プレイヤーの削除
    this.player.destroy();
    
    
    this.time.addEvent({
        delay:1500,
        callback:this.gameover,
        loop:false,
        callbackScope:this,
    });
};

mainScene.gameover = function() {
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;

    this.gameoverimage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    this.gameoverimage.setDisplaySize(50, 50);
    this.gameoverimage.dx = 5;
    this.gameoverimage.dy = 5;
    
    
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    },this);
};

mainScene.countdowntime = function() {
    this.counttext = this.add.text(500, 200, this.count, {
        font:'30px Open Sans',
        fill:'#0000ff'
    });
    
    this.counttext.setText( "time:" + this.count);
    
    this.counttext.setScrollFactor(0);
    
    this.countdowntimer = this.time.addEvent ({
        delay:1000,
        callback: this.countdown,
        loop: true,
        callbackScope: this
    });
};

mainScene.countdown = function() {
    this.count--;
    if( this.count <= 0) {
        this.count = 0;
    }
    this.counttext.setText( "time:" + this.count);

    if( this.count == 0 ) {
        this.createGameClear();
    }
};

mainScene.createGameClear = function() {
    this.physics.pause();
    this.isgameOver = true;
    this.countdowntimer.remove();
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    
    this.gameclear = this.add.image(cameraPositionX, cameraPositionY, 'gameclear');
    this.gameclear.setDisplaySize( 500, 130 );
    
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    },this);
};