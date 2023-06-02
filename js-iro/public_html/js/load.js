// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');

    this.load.spritesheet('player','assets/images/player1.png',
    //整理のため改行
     { frameWidth: 32, frameHeight: 32 });
     
     // マップ用画像
    this.load.image('white','assets/images/white.png');
    this.load.image('black','assets/images/black.png');
    this.load.image('tansu','assets/images/tansu.png');
    this.load.image('kinko','assets/images/kinko.jpg');
    this.load.image('gray','assets/images/gray.png');
    this.load.image('gameclear','assets/images/clear.png');
    this.load.image('reba-','assets/images/reba-.png');
    this.load.image('reba-2','assets/images/reba-1.png');
    this.load.image('black+','assets/images/black+.png');
    
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
