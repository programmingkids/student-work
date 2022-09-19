// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    // ゲームクリア画像
    this.load.image('gameclear', 'assets/images/gameclear.png');
    
    // 背景画像
    this.load.image('background', 'assets/images/space1.jpg');
    this.load.image('background2', 'assets/images/space2.jpg');
    this.load.image('background3', 'assets/images/space3.jpg');
    
    // プレイヤーの画像
    this.load.image('player', 'assets/images/player1.png');
    
    // 敵の画像
    this.load.image('enemy', 'assets/images/enemy.png');
    
    // ビームの画像
    this.load.image('beam', 'assets/images/beam.png');
    
    // 敵のビームの画像
    this.load.image('enemyBeam', 'assets/images/beam2.png');
    
    // 敵の爆発パーティクルの画像
    this.load.image('bomb', 'assets/images/bomb1.png');
    
    // スコアアップアイテムの画像
    this.load.image('treasure', 'assets/images/item1.png');
    // 欠片の画像
    this.load.image('fragment1', 'assets/images/fragment1.png');
    // 回復アイテムの画像
    this.load.image('heart', 'assets/images/item2.png');
    // 防御アイテムの画像
    this.load.image('shield', 'assets/images/item3.png');
    // 妨害アイテムの画像
    this.load.image('rock1', 'assets/images/rock1.png');
    this.load.image('rock2', 'assets/images/rock2.png');
    this.load.image('rock3', 'assets/images/rock3.png');
    // 妨害アイテムの破片の画像
    this.load.image('rock4', 'assets/images/rock4.png');
    // 特殊攻撃アイテムの画像
    this.load.image('thunder', 'assets/images/thunder.png');
    
    // 特殊攻撃ビームの画像
    this.load.image('S-beam', 'assets/images/beam3.png');
    
    // ボス敵の画像
    this.load.image('boss', 'assets/images/boss.png');
    
    // ボスの攻撃の画像
    this.load.image('missile', 'assets/images/missile.png');
    this.load.image('bossbeam', 'assets/images/Bossbeam.png');
    
    // ミサイルの爆発パーティクルの画像
    this.load.image('bomb2', 'assets/images/bomb1.png');
    
    // ビームの予告の画像
    this.load.image('right1', 'assets/images/redRight1.png');
    this.load.image('right2', 'assets/images/redRight2.png');
    this.load.image('right3', 'assets/images/redRight3.png');
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};