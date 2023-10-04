// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    //クリア画像
    this.load.image('gameclear','assets/images/gameclear.png');
    
    // マップデータ
    this.load.tilemapTiledJSON('Wall', 'assets/data/Wall.json');
    // マップスプライト画像
    this.load.spritesheet('Wall', 'assets/images/Wall.png', {frameWidth: 16, frameHeight: 16});
    
    //プレイヤースプライト画像
    this.load.spritesheet('player', 'assets/images/player3.png', {frameWidth: 60, frameHeight: 84});
    
    //ホールドスプライト画像
    this.load.image('hold1','assets/images/hold1.png');
    this.load.image('hold2','assets/images/hold2.png');
    this.load.image('hold3','assets/images/hold3.png');
    
    //コインスプライト画像
    this.load.image('coin','assets/images/coin.png');
    this.load.image('coin2','assets/images/coin2.png');
    
    //ゴールスプライト画像
    this.load.image('goalflag','assets/images/goalflag.png');
    
    //岩スプライト画像
    this.load.image('stone','assets/images/stone.png');
};
loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
