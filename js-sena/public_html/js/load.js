// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');

    this.load.image('bird', 'assets/images/jets.png');
    
    this.load.image('pipe_down', 'assets/images/pipe_down.gif');
    this.load.image('pipe_up', 'assets/images/pipe_up.gif');
    
    this.load.image('background', 'assets/images/background.jpg');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
