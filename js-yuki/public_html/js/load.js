// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    // マップデータ
    this.load.tilemapTiledJSON('map01', 'assets/data/map01.json');
    this.load.tilemapTiledJSON('map02', 'assets/data/map02.json');
    this.load.tilemapTiledJSON('map03', 'assets/data/map03.json');
    // マップスプライト画像
    this.load.spritesheet('tiles', 'assets/images/tiles01.png', {frameWidth: 70, frameHeight: 70});
    // プレイヤースプライト画像
    this.load.spritesheet('player', 'assets/images/player4.png', { frameWidth: 32, frameHeight: 32 });
    // スター画像
    this.load.image('star', 'assets/images/star.png');
    // 敵画像
    this.load.image('enemy01', 'assets/images/enemy01.png');
    this.load.image('enemy02', 'assets/images/enemy02.png');
    this.load.image('enemy05', 'assets/images/enemy05.png');
    this.load.image('enemy07', 'assets/images/enemy07.png');
    this.load.image('enemy08', 'assets/images/enemy08.png');
    this.load.image('enemy09', 'assets/images/enemy09.png');
    // ボール画像
    this.load.image('ball01', 'assets/images/ball01.png');
    this.load.image('ball02', 'assets/images/ball02.png');
    this.load.image('ball03', 'assets/images/ball03.png');
    this.load.image('ball04', 'assets/images/ball04.png');
    this.load.image('ball05', 'assets/images/ball05.png');
    
    this.load.image('fire02', 'assets/images/fire02.png');
    
    this.load.image('bone', 'assets/images/bone.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
