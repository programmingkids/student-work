var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // 地面を作成する。タイルスプライトで最下部に敷き詰める
    //this.ground = this.add.tileSprite(400, this.worldHeight-20, this.worldWidth, 40, 'ground');
    // 地面のタイルスプライトを物理エンジン対象にする
    //this.physics.add.existing(this.ground, true);
    
    this.ground2 = this.add.tileSprite(160,150,320,40, 'ground');
    this.physics.add.existing(this.ground2, true);
    
    this.flag = this.physics.add.image(40,100,'flag');
    this.flag.body.setSize(40,40);
    this.flag.setDisplaySize(70,70);
    this.flag.setImmovable(true);
    
    this.flag.body.setAllowGravity(false);
    this.physics.world.bounds.width = this.worldWidth;
    this.physics.world.bounds.height = this.worldHeight;
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    
    this.createPlayer(); 
    this.createStones();
    this.createClouds();
    this.createUI();
    this.createItemgroup1();
    this.createItemgroup2();
};

mainScene.update = function() {
  if(this.gamestop == true) {
    return;
  }
  var cursors = this.input.keyboard.createCursorKeys();
  if(cursors.right.isDown) {
    // 右向きのアニメーション
    this.player.anims.play('right', true);
    // 右に移動
    this.player.setVelocityX(this.runSpeed);
  } else if(cursors.left.isDown) {
    // 左向きのアニメーション
    this.player.anims.play('left', true);
    // 左に移動
    this.player.setVelocityX(-this.runSpeed);
  } else {
    // アニメーション停止
    this.player.anims.stop();
    // 移動停止
    this.player.setVelocityX(0);
  }
  // スペースキーをクリックしたら
  if(cursors.space.isDown && this.player.body.touching.down) {
    // ジャンプ
    this.player.setVelocityY(-this.jumpPower);
  }
  if(this.player.y > 5010) {
    this.gameover();  
  }
  if(this.player.y < 4300 && this.h4300 == false) {
    this.setScore(100)
    this.h4300 = true;
  }
  if(this.player.y < 4000 && this.h4000 == false) {
    this.setScore(20)
    this.h4000 = true;
  }
  if(this.player.y < 3500 && this.h3500 == false) {
    this.setScore(30)
    this.h3500 = true;
  }
  if(this.player.y < 3000 && this.h3000 == false) {
    this.setScore(40)
    this.h3000 = true;
  }
  if(this.player.y < 2500 && this.h2500 == false) {
    this.setScore(50)
    this.h2500 = true;
  }
  if(this.player.y < 2000 && this.h2000 == false) {
    this.setScore(60)
    this.h2000 = true;
  }
  if(this.player.y < 1500 && this.h1500 == false) {
    this.setScore(70)
    this.h1500 = true;
  }
  if(this.player.y < 1000 && this.h1000 == false) {
    this.setScore(80)
    this.h1000 = true;
  }
  if(this.player.y < 500 && this.h500 == false) {
    this.setScore(90)
    this.h500 = true;
  }
  if(this.player.y < 50 && this.h50 == false) {
    this.setScore(60)
    this.h50 = true;
  }
};

mainScene.config = function () {
    this.runSpeed = 200;
    this.jumpPower = 650;
    //this.jumpPower = 1500;
    this.worldWidth = 800;
    this.worldHeight = 5000;
    this.gamestop = false;
    this.score = 0;
    this.h4300 = false;
    this.h4000 = false;
    this.h3500 = false;
    this.h3000 = false;
    this.h2500 = false;
    this.h2000 = false;
    this.h1500 = false;
    this.h1000 = false;
    this.h500 = false;
    this.h50 = false;
  
};

mainScene.createPlayer = function () {
    // 物理エンジン対応のプレイヤスプライト読み込み
  this.player = this.physics.add.sprite(200, 4700, 'player');
  // プレイヤーの表示サイズ変更
  this.player.setDisplaySize(70,70);
  this.player.setDepth(1);
  // プレイヤーの最初のフレームを設定
  this.player.setFrame(7);
  // プレイヤーがゲーム空間と衝突
  //this.player.setCollideWorldBounds(true);
  // プレイヤーと地面の衝突
  //this.physics.add.collider(this.player, this.ground);
  this.physics.add.collider(this.player, this.ground2);
  this.physics.add.overlap(this.player, this.flag,this.hitflag,null,this);
  
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
  this.cameras.main.startFollow (this.player);
}
mainScene.createStones = function () {
  this.stoneGroup = this.physics.add.group();
  this.physics.add.collider(this.player, this.stoneGroup, this.hitStone, null,this);
  
  var stone1 = this.stoneGroup.create(200, 4800,'stone');
  stone1.setDisplaySize(70, 70);
  stone1.setImmovable(true);
  stone1.body.setAllowGravity(false);
  
  var stone2 = this.stoneGroup.create(500, 4650, "stone");
  stone2.setDisplaySize(70, 70);
  stone2.setImmovable(true);
  stone2.body.setAllowGravity(false);
  
  var stone3 = this.stoneGroup.create(280, 4450, "stone");
  stone3.setDisplaySize(70, 70);
  stone3.setImmovable(true);
  stone3.body.setAllowGravity(false);
  
  var stone4 = this.stoneGroup.create(100, 4300,'stone');
  stone4.setDisplaySize(70, 70);
  stone4.setImmovable(true);
  stone4.body.setAllowGravity(false);
  
  var stone5 = this.stoneGroup.create(200, 4100,'stone');
  stone5.setDisplaySize(70, 70);
  stone5.setImmovable(true);
  stone5.body.setAllowGravity(false);
  
  var stone6 = this.stoneGroup.create(300, 3900,'stone');
  stone6.setDisplaySize(70, 70);
  stone6.setImmovable(true);
  stone6.body.setAllowGravity(false);
  
  var stone7 = this.stoneGroup.create(450, 3700,'stone');
  stone7.setDisplaySize(70, 70);
  stone7.setImmovable(true);
  stone7.body.setAllowGravity(false);
  
  var stone8 = this.stoneGroup.create(170, 3550,'stone');
  stone8.setDisplaySize(70, 70);
  stone8.setImmovable(true);
  stone8.body.setAllowGravity(false);
  
  var stone9 = this.stoneGroup.create(250, 3350,'stone');
  stone9.setDisplaySize(70, 70);
  stone9.setImmovable(true);
  stone9.body.setAllowGravity(false);
  
  var stone10 = this.stoneGroup.create(150, 3150,'stone');
  stone10.setDisplaySize(70, 70);
  stone10.setImmovable(true);
  stone10.body.setAllowGravity(false);
  
  var stone11 = this.stoneGroup.create(450, 3000,'stone');
  stone11.setDisplaySize(70, 70);
  stone11.setImmovable(true);
  stone11.body.setAllowGravity(false);
  
  var stone12 = this.stoneGroup.create(230, 2800,'stone');
  stone12.setDisplaySize(70, 70);
  stone12.setImmovable(true);
  stone12.body.setAllowGravity(false);
  
  var stone13 = this.stoneGroup.create(400, 2650,'stone');
  stone13.setDisplaySize(70, 70);
  stone13.setImmovable(true);
  stone13.body.setAllowGravity(false);
  
  var stone14 = this.stoneGroup.create(110, 2480,'stone');
  stone14.setDisplaySize(70, 70);
  stone14.setImmovable(true);
  stone14.body.setAllowGravity(false);
  
  var stone15 = this.stoneGroup.create(250, 2280,'stone');
  stone15.setDisplaySize(70, 70);
  stone15.setImmovable(true);
  stone15.body.setAllowGravity(false);
  
  var stone16 = this.stoneGroup.create(500, 2080,'stone');
  stone16.setDisplaySize(70, 70);
  stone16.setImmovable(true);
  stone16.body.setAllowGravity(false);
  
  var stone17 = this.stoneGroup.create(250, 1930,'stone');
  stone17.setDisplaySize(70, 70);
  stone17.setImmovable(true);
  stone17.body.setAllowGravity(false);
  
  var stone18 = this.stoneGroup.create(500, 1740,'stone');
  stone18.setDisplaySize(70, 70);
  stone18.setImmovable(true);
  stone18.body.setAllowGravity(false);
  
  var stone19 = this.stoneGroup.create(250, 1550,'stone');
  stone19.setDisplaySize(70, 70);
  stone19.setImmovable(true);
  stone19.body.setAllowGravity(false);
  
  var stone20 = this.stoneGroup.create(200, 1350,'stone');
  stone20.setDisplaySize(70, 70);
  stone20.setImmovable(true);
  stone20.body.setAllowGravity(false);
  
  var stone21 = this.stoneGroup.create(80, 1170,'stone');
  stone21.setDisplaySize(70, 70);
  stone21.setImmovable(true);
  stone21.body.setAllowGravity(false);
  
  var stone22 = this.stoneGroup.create(250, 1000,'stone');
  stone22.setDisplaySize(70, 70);
  stone22.setImmovable(true);
  stone22.body.setAllowGravity(false);
  
  var stone23 = this.stoneGroup.create(400, 830,'stone');
  stone23.setDisplaySize(70, 70);
  stone23.setImmovable(true);
  stone23.body.setAllowGravity(false);
  
  var stone24 = this.stoneGroup.create(480, 630,'stone');
  stone24.setDisplaySize(70, 70);
  stone24.setImmovable(true);
  stone24.body.setAllowGravity(false);
  
  var stone25 = this.stoneGroup.create(250, 500,'stone');
  stone25.setDisplaySize(70, 70);
  stone25.setImmovable(true);
  stone25.body.setAllowGravity(false);
  
  var stone26 = this.stoneGroup.create(350, 300,'stone');
  stone26.setDisplaySize(70, 70);
  stone26.setImmovable(true);
  stone26.body.setAllowGravity(false);
  

}

mainScene.hitStone = function (player,stone) {
  if(player.body.touching.down && stone.body.touching.up) {
        this.player.setVelocityY(-this.jumpPower)
  }
}
mainScene.hitflag = function(player,flag) {
  //物理エンジン停止
    this.physics.pause();
    //プレイヤーのアニメーション停止
    this.player.anims.stop();
    //ゲームオーバーにして、updateの動作停止
    this.gamestop = true;
    //1秒後にゲームオーバー画面
    this.time.addEvent({
        delay: 2000,
        callback: this.movegameclear,
        loop: false,
        callbackScope: this
    });
    
}
mainScene.gameover = function() {
    //物理エンジン停止
    this.physics.pause();
    //プレイヤーのアニメーション停止
    this.player.anims.stop();
    //ゲームオーバーにして、updateの動作停止
    this.gamestop = true;
    //1秒後にゲームオーバー画面
    this.time.addEvent({
        delay: 1000,
        callback: this.movegameOver,
        loop: false,
        callbackScope: this
    });
};
mainScene.movegameOver = function() {
  this.scene.start('gameoverScene',{score:this.score});
  
}
mainScene.movegameclear = function() {
  this.scene.start('gameclearScene',{score:this.score});
}
mainScene.createClouds = function() {
  this.cloudgroup = this.add.group();
  
  var c1 = this.cloudgroup.create(200,4500,'cloud');
  c1.setDisplaySize(200,200)
  
  var c2 = this.cloudgroup.create(400,4300,'cloud');
  c2.setDisplaySize(180,180)
  
  var c3 = this.cloudgroup.create(80,4100,'cloud');
  c3.setDisplaySize(200,200)
  
  var c4 = this.cloudgroup.create(300,3800,'cloud');
  c4.setDisplaySize(150,150)
  
  var c5 = this.cloudgroup.create(300,3600,'cloud');
  c5.setDisplaySize(200,200)
  
  var c6 = this.cloudgroup.create(100,3400,'cloud');
  c6.setDisplaySize(130,130)
  
  var c7 = this.cloudgroup.create(500,3200,'cloud');
  c7.setDisplaySize(300,300)
  
  var c8 = this.cloudgroup.create(200,3000,'cloud');
  c8.setDisplaySize(180,180)
  
  var c9 = this.cloudgroup.create(80,2750,'cloud');
  c9.setDisplaySize(200,200)
  
  var c10 = this.cloudgroup.create(450,2450,'cloud');
  c10.setDisplaySize(180,180)
  
  var c11 = this.cloudgroup.create(500,2400,'cloud');
  c11.setDisplaySize(160,160)
  
  var c12 = this.cloudgroup.create(100,2100,'cloud');
  c12.setDisplaySize(200,200)
  
  var c13 = this.cloudgroup.create(200,1800,'cloud');
  c13.setDisplaySize(160,160)
  
  var c14 = this.cloudgroup.create(170,1740,'cloud');
  c14.setDisplaySize(200,200)
  
  var c15 = this.cloudgroup.create(320,1300,'cloud');
  c15.setDisplaySize(150,150)
  
  var c16 = this.cloudgroup.create(350,1280,'cloud');
  c16.setDisplaySize(160,160)
  
  var c17 = this.cloudgroup.create(420,1150,'cloud');
  c17.setDisplaySize(170,170)
  
  var c18 = this.cloudgroup.create(500,1100,'cloud');
  c18.setDisplaySize(200,200)
  
  var c19 = this.cloudgroup.create(500,1100,'cloud');
  c19.setDisplaySize(200,200)
  
  var c20 = this.cloudgroup.create(200,800,'cloud');
  c20.setDisplaySize(350,350)
  
  var c21 = this.cloudgroup.create(450,480,'cloud');
  c21.setDisplaySize(200,200)
  
  var c22 = this.cloudgroup.create(200,300,'cloud');
  c22.setDisplaySize(180,180)
  
  var c23 = this.cloudgroup.create(500,50,'cloud');
  c23.setDisplaySize(200,200)
}
mainScene.createUI = function() {
    // UI作成
    var scoreText = 'スコア:' + this.score;
    //画面右上に赤色テキスト表示
    this.text = this.add.text(620, 40, scoreText, {
        fontSize: '30px',
        fill: '#ff0000',
        fontStyle: 'bold'
    });
    //文字は固定表示（カメラに合わせて移動しない)
    this.text.setScrollFactor(0);
    
};
mainScene.setScore = function(score) {
    //スコアアップ
    this.score += score;
    var scoreText = 'スコア:' + this.score;
    this.text.setText(scoreText);
};
mainScene.createItemgroup1 = function () {
  this.Itemgroup1 = this.physics.add.group();
  this.physics.add.overlap(this.player, this.Itemgroup1, this.hitItem1, null,this);
  this.time.addEvent({
      delay: 5000,
      callback: this.createItem1,
      loop: true,
      callbackScope: this
    });
}
mainScene.createItem1 = function () {
  var x = Phaser.Math.RND.between(100, 700);
  var Item1 = this.Itemgroup1.create(x,0,'item1');
  Item1.setDisplaySize(100,100);
  Item1.body.setGravityY(-950);
}
mainScene.hitItem1 = function (player,item1) {
  item1.destroy();
  this.setScore(30);
}
mainScene.createItemgroup2 = function () {
  this.Itemgroup2 = this.physics.add.group();
  this.physics.add.collider(this.player, this.Itemgroup2);
  this.time.addEvent({
      delay: 5000,
      callback: this.createItem2,
      loop: true,
      callbackScope: this
    });
}
mainScene.createItem2 = function () {
  var x = Phaser.Math.RND.between(100, 700);
  var Item2 = this.Itemgroup2.create(x,0,'stone');
  Item2.setDisplaySize(80,80);
  Item2.body.setGravityY(-920);
  Item2.setTint(0x800000);
}
