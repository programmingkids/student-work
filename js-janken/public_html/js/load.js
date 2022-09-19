// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    
    // じゃんけん
    this.load.image('gu', 'assets/images/janken_gu.png');
    this.load.image('choki', 'assets/images/janken_choki.png');
    this.load.image('pa', 'assets/images/janken_pa.png');
    
    // リスタート画像
    this.load.image('button_restart', 'assets/images/button_restart.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
