// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.jpg');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('gameclear', 'assets/images/gameclear2.png');
    this.load.spritesheet('player', 'assets/images/player1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('stone', 'assets/images/stone.png');
    this.load.image('flag', 'assets/images/flag.png');
    this.load.image('stage', 'assets/images/stage.png');
    this.load.image('cloud', 'assets/images/cloud.png');
    this.load.image('item1', 'assets/images/item1.png');
    this.load.image('item2', 'assets/images/item2.png');
    
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
