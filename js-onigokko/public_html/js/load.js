// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    
    // 敵
    this.load.image('enemy001', 'assets/images/enemy001.png');
    this.load.image('enemy002', 'assets/images/enemy002.png');
    this.load.image('enemy003', 'assets/images/enemy003.png');
    this.load.image('enemy004', 'assets/images/enemy004.png');
    this.load.image('enemy005', 'assets/images/enemy005.png');
    this.load.image('enemy006', 'assets/images/enemy006.png');
    this.load.image('enemy007', 'assets/images/enemy007.png');
    this.load.image('enemy008', 'assets/images/enemy008.png');
    this.load.image('enemy009', 'assets/images/enemy009.png');
    
    // プレイヤー
    this.load.spritesheet('player', 'assets/images/player04.png', {
        frameWidth: 32, 
        frameHeight: 32,
    });
    
    // star
    this.load.image('star', 'assets/images/star.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
