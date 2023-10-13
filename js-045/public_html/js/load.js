// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.tilemapTiledJSON('map01', 'assets/data/actiongame.json');
    this.load.spritesheet('tiles', 'assets/images/tiles02.png', {frameWidth: 70, frameHeight: 70});
    this.load.spritesheet('player', 'assets/images/player2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('enemy09', 'assets/images/enemy09.png');
    this.load.image('enemy10', 'assets/images/enemy10.png');
    this.load.image('ball04','assets/images/ball04.png');
    this.load.image('ball03','assets/images/ball03.png');
    this.load.image('gameclear','assets/images/gameclear.jpg');
    this.load.image('gameover','assets/images/gameover.jpeg');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
