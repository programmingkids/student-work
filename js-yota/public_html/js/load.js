// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    this.load.image('gameclear','assets/images/gameclear.png');
    this.load.tilemapTiledJSON('map01', 'assets/data/map01.json');
    this.load.tilemapTiledJSON('map02', 'assets/data/map02.json');
    this.load.tilemapTiledJSON('map03', 'assets/data/map03.json');
    this.load.spritesheet('tilesheet_complete','assets/images/tilesheet_complete.png',{frameWidth:64, frameHeight:64});
    this.load.spritesheet('player','assets/images/zombie_tilesheet.png',{frameWidth:80, frameHeight:110});
    this.load.image('enemy01', 'assets/images/enemyWalking_1.png',{frameWidth:32, frameHeight:44});
    this.load.image('enemy02','assets/images/enemyFlying_1.png',{frameWidth:32,frameHeight:44});
    this.load.image('ball','assets/images/ball01.png',{frameHeight:128, frameWidth:128});
    this.load.image('star','assets/images/star.png', {frameHeight: 70, frameWidth:70});
    this.load.image('enemy03','assets/images/enemy02.png',{frameHeight:480, frameWidth:480});
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
