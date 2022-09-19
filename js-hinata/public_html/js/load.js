// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    // ゲームクリア画像
    this.load.image('gamecrear', 'assets/images/gamecrear.gif');
    // 背景画像
    this.load.image('background01', 'assets/images/backgroundColorGrass.png');
    // マップデータ
    this.load.tilemapTiledJSON('map03','assets/data/map01.json');
    // プレイヤースプライト
    this.load.image('player', 'assets/images/player.png');
    // 敵画像
    this.load.image('enemy01', 'assets/images/enemy01.png');
    this.load.image('enemy02', 'assets/images/enemy02.png');
    this.load.image('enemy03', 'assets/images/enemy03.png');
    this.load.image('enemy04', 'assets/images/enemy04.png');
    // 弾画像
    this.load.image('ball01', 'assets/images/ball01.png');
    this.load.image('beam01','assets/images/beam01.png');
    // アイテム画像
    this.load.image('item01', 'assets/images/item01.png');
    this.load.image('item02', 'assets/images/item02.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
