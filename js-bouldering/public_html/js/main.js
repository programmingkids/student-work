var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#ede4cd');
    
    //マップ表示
    this.createMap();
    
    //ホールド作成
    this.createhold();
    
    //プレイヤー作成
    this.createplayer();
    
    //ゴールの旗作成
    this.createFlag();
    
    //コイン作成
    this.createcoin();
    
    //障害物(岩)作成
    this.createstoneGroup();
    
    //文字の表示
    this.scoretext = this.add.text(50,50,"coin:" + this.score + "/8",{
       font: '30px Open Sans',
       fill: '#2b2b2b'
    });
    this.scoretext.setScrollFactor(0);
};

mainScene.update = function() {
    //プレイヤーの操作処理
    if(this.cursors.left.isDown) {
        this.player.setVelocityX(-this.runSpeed);
        this.player.setFrame(0);
    }else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.runSpeed);
        this.player.setFrame(2);
    }else{
        //キーを離したとき
        this.player.setVelocityX(0);
        this.player.setFrame(1);
    }
    //じゃんぷ
    if(this.cursors.up.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-this.jumpPower);
    }
    if(this.cursors.up.isDown && this.holding == true) {
        this.player.setVelocityY(-this.jumpPower);
    }
    if(this.holding == true) {
        this.player.setFrame(3);
    }
    //ホールドと接しているか
    this.judge();
};

mainScene.createMap = function() {
    // マップ表示
    var layerWidth = 16 * 20 * 3;
    var layerHeight = 16 * 25 * 3;
    
    this.map = this.make.tilemap({key:'Wall'});

    var Wall = this.map.addTilesetImage('Wall');
    this.Layer1 = this.map.createDynamicLayer('layer1',Wall,0,0);
    this.Layer1.setDisplaySize(layerWidth, layerHeight);

    //「-1」は空のタイルなので衝突しない。それ以外は衝突する
    this.Layer1.setCollisionByExclusion([-1]);
    
    this.Layer2 = this.map.createDynamicLayer('layer2',Wall,0,0);
    this.Layer2.setDisplaySize(layerWidth, layerHeight);

    this.physics.world.bounds.width = this.Layer1.displayWidth;
    this.physics.world.bounds.height = this.Layer1.displayHeight;

    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);

    this.cameras.main.centerOn(50,850);
};

//初期設定
mainScene.config = function () {
    //プレイヤーの動く速度
    this.runSpeed = 300;
    //プレイヤーのジャンプパワー
    this.jumpPower = 400;
    //カーソルの取得
    this.cursors = this.input.keyboard.createCursorKeys();
    //掴んでるかの
    this.holding = false;
    //スコア
    this.score = 0;
};

mainScene.createplayer = function () {
    // プレイヤー作成
    this.player = this.physics.add.sprite(100, 1100, 'player');
    // 衝突サイズの調整
    // 表示サイズを変更する前に、物理エンジンでの判定サイズの変更
    this.player.body.setSize(61,84);
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(61,84);
    // プレイヤーの最初の向きは正面
    this.player.setFrame(1);
    this.player.direction = 'center';
    // プレイヤーの衝突時のバウンス設定
    this.player.setBounce(0);
    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.player.setCollideWorldBounds(true);
    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.Layer1);
    //カメラのプレイヤー追跡
    this.cameras.main.startFollow(this.player);
    //プレイヤーとホールドが衝突
    this.physics.add.overlap(this.player, this.holdGroup, this.hithold, null, this);
};

mainScene.createcoin = function () {
    //コインの位置決めてきます→8個
    this.coinGroup = this.physics.add.group();
    //コインとプレイヤーは衝突でｋ
    this.physics.add.overlap(this.player, this.coinGroup, this.hitcoin, null, this);
    //一個ずつコイン作成
    this.coin1 = this.coinGroup.create(600,150, 'coin2');
    this.coin1.setDisplaySize(40,40);
    this.coin1.body.setAllowGravity(false);

    this.coin2 = this.coinGroup.create(120,860, 'coin');
    this.coin2.setDisplaySize(40,40);
    this.coin2.body.setAllowGravity(false);
    
    this.coin3 = this.coinGroup.create(900,1150, 'coin');
    this.coin3.setDisplaySize(40,40);
    this.coin3.body.setAllowGravity(false);
    
    this.coin4 = this.coinGroup.create(360,750, 'coin2');
    this.coin4.setDisplaySize(40,40);
    this.coin4.body.setAllowGravity(false);
    
    this.coin5 = this.coinGroup.create(900,900, 'coin');
    this.coin5.setDisplaySize(40,40);
    this.coin5.body.setAllowGravity(false);

    this.coin6 = this.coinGroup.create(900,450, 'coin2');
    this.coin6.setDisplaySize(40,40);
    this.coin6.body.setAllowGravity(false);
    
    this.coin7 = this.coinGroup.create(240,230, 'coin');
    this.coin7.setDisplaySize(40,40);
    this.coin7.body.setAllowGravity(false);
    
    this.coin8 = this.coinGroup.create(100,600, 'coin');
    this.coin8.setDisplaySize(40,40);
    this.coin8.body.setAllowGravity(false);
};

mainScene.createhold = function () {
    //ホールド作成(17コ)
    this.holdGroup = this.physics.add.group();
    //ホールドを一個ずつ作成
    this.hold1 = this.holdGroup.create(90,980, 'hold1');
    this.hold1.setDisplaySize(21,28);
    this.hold1.body.setAllowGravity(false);
    this.hold1.holding = false;
    
    this.hold2 = this.holdGroup.create(90,700, 'hold2');
    this.hold2.setDisplaySize(21,28);
    this.hold2.body.setAllowGravity(false);
    this.hold2.holding = false;
    
    this.hold3 = this.holdGroup.create(270,950, 'hold3');
    this.hold3.setDisplaySize(21,28);
    this.hold3.body.setAllowGravity(false);
    this.hold3.holding = false;
    
    this.hold4 = this.holdGroup.create(500,800, 'hold1');
    this.hold4.setDisplaySize(21,28);
    this.hold4.body.setAllowGravity(false);
    this.hold4.holding = false;
    
    this.hold5 = this.holdGroup.create(700,900, 'hold2');
    this.hold5.setDisplaySize(21,28);
    this.hold5.body.setAllowGravity(false);
    this.hold5.holding = false;
    
    this.hold6 = this.holdGroup.create(450,700, 'hold3');
    this.hold6.setDisplaySize(21,28);
    this.hold6.body.setAllowGravity(false);
    this.hold6.holding = false;
    
    this.hold7 = this.holdGroup.create(800,750, 'hold1');
    this.hold7.setDisplaySize(21,28);
    this.hold7.body.setAllowGravity(false);
    this.hold7.holding = false;
    
    this.hold8 = this.holdGroup.create(300,600, 'hold2');
    this.hold8.setDisplaySize(21,28);
    this.hold8.body.setAllowGravity(false);
    this.hold8.holding = false;
    
    this.hold9 = this.holdGroup.create(600,600, 'hold3');
    this.hold9.setDisplaySize(21,28);
    this.hold9.body.setAllowGravity(false);
    this.hold9.holding = false;
    
    //ここから上半分
    this.hold10 = this.holdGroup.create(180,500, 'hold1');
    this.hold10.setDisplaySize(21,28);
    this.hold10.body.setAllowGravity(false);
    this.hold10.holding = false;
    
    this.hold11 = this.holdGroup.create(450,420, 'hold2');
    this.hold11.setDisplaySize(21,28);
    this.hold11.body.setAllowGravity(false);
    this.hold11.holding = false;
    
    this.hold12 = this.holdGroup.create(600,300, 'hold3');
    this.hold12.setDisplaySize(21,28);
    this.hold12.body.setAllowGravity(false);
    this.hold12.holding = false;
    
    this.hold13 = this.holdGroup.create(300,150, 'hold1');
    this.hold13.setDisplaySize(21,28);
    this.hold13.body.setAllowGravity(false);
    this.hold13.holding = false;
    
    this.hold14 = this.holdGroup.create(700,150, 'hold2');
    this.hold14.setDisplaySize(21,28);
    this.hold14.body.setAllowGravity(false);
    this.hold14.holding = false;
    
    this.hold15 = this.holdGroup.create(850,350, 'hold3');
    this.hold15.setDisplaySize(21,28);
    this.hold15.body.setAllowGravity(false);
    this.hold15.holding = false;
    
    this.hold16 = this.holdGroup.create(500,200, 'hold1');
    this.hold16.setDisplaySize(21,28);
    this.hold16.body.setAllowGravity(false);
    this.hold16.holding = false;
    

};

mainScene.createstoneGroup = function() {
    //グループ作成
    this.stoneGroup = this.physics.add.group();
    //衝突の設定
    this.physics.add.overlap(this.player,this.stoneGroup,this.hitstone,null,this);
    
    this.time.addEvent({
        delay: 2000,
        callback: this.createstone,
        loop: true,
        callbackScope: this
    });
};

mainScene.createstone = function() {
    //X座標乱数
    var positionX = Phaser.Math.RND.between(0,1000);
    //岩を召喚！！
    var stone = this.stoneGroup.create(positionX,0,'stone');
    stone.setDisplaySize(50,40);
    
    
};

mainScene.hitcoin = function(player,coin) {
    coin.destroy();
    this.score += 1;
    this.scoretext.setText("coin:"+ this.score + "/8");
};

mainScene.hithold = function(player, hold) {
    if(this.holding == true){
        return;
    }
    this.player.body.setAllowGravity(false);
    this.player.setVelocity(0);
    this.player.x = hold.x;
    this.player.y = hold.y + 30;
    this.holding = true;
    hold.holding = true;
    this.player.setFrame(3);
    
    
    
};

mainScene.hitstone = function(player, stone) {
    
    if(stone.body.touching.down) {
        stone.setVelocityY(-150);
        player.setVelocityY(200);
        stone.setTint(0xff0000);
        this.time.addEvent({
            delay: 200,
            callback: this.ChangeStoneColor,
            loop: false,
            callbackScope: this,
            args:[stone],
        });
    }
}

mainScene.ChangeStoneColor = function(stone) {
    stone.clearTint();
}

mainScene.createFlag = function() {
    //旗作成
    this.Flag1 = this.physics.add.sprite(300,65 , 'goalflag');
    this.Flag1.setDisplaySize(30,35);
    this.Flag1.body.setAllowGravity(false);
    
    this.Flag2 = this.physics.add.sprite(700,65 , 'goalflag');
    this.Flag2.setDisplaySize(30,35);
    this.Flag2.body.setAllowGravity(false);
    
    //プレイヤーと旗が衝突
    this.physics.add.overlap(this.player, this.Flag1, this.hitFlag, null, this);
    this.physics.add.overlap(this.player, this.Flag2, this.hitFlag, null, this);
};

mainScene.judge = function() {
    if(this.holding == false){
        return;
    }
    //当たり判定のやつ割り出す
    var playerrect = this.player.getBounds();
    var holds = this.holdGroup.getChildren();
    //ホールドの確認
    for(var i in holds) {
        var hold = holds[i];
        if(hold.holding == false) {
            continue;
        }
        var holdrect = hold.getBounds();
        if(!Phaser.Geom.Intersects.RectangleToRectangle(playerrect, holdrect)) {
            this.player.body.setAllowGravity(true);
            this.holding = false;
            hold.holding = false;
            this.player.setFrame(1);
        }
    }
};

mainScene.hitFlag = function() {
    this.scene.start("clearScene",{
        score:this.score
    });
};

