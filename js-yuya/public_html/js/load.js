// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    //ゲームクリア
    this.load.image('gameclear','assets/images/clearScene.jpg');
    this.load.tilemapTiledJSON('map04','assets/data/map04.tmj');
    this.load.tilemapTiledJSON('map08','assets/data/map08.tmj');
    //マップスプライト画像
    this.load.spritesheet('tile','assets/images/tiles_packed.png',
    {frameWidth: 18, frameHeight: 18});
    //敵画像の読み込み
    this.load.image('enemy01','assets/images/enemy10.png');
    this.load.image('enemy02','assets/images/enemy11.png');
    this.load.image('enemy03','assets/images/enemy12.png');
    this.load.image('enemy04','assets/images/enemy09.png');
    this.load.image('enemy05','assets/images/enemy02.png');
    
    //攻撃画像
    this.load.image('fire','assets/images/fire01.png');
    //プレイヤー画像の読み込み
    this.load.spritesheet('player', 'assets/images/player5.png', { frameWidth: 32, frameHeight: 32 })
    //ボール画像の読み込み
    this.load.image('ball','assets/images/ball04.png');
    //ボス画像の読み込み
    this.load.image('boss','assets/images/enemy12.png');
    //扉画像の読み込み
    this.load.image('door','assets/images/tile_0021.png');
    //アイテム画像の読み込み
    this.load.image('item','assets/images/item1.png');
    //武器画像の読み込み
    this.load.image('weapon','assets/images/item02.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
