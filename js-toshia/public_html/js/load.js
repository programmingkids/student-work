// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    
    this.load.image('gameclear' ,'assets/images/gameclear.png');
    
    this.load.tilemapTiledJSON('map1', 'assets/data/map1.json');
    this.load.spritesheet('tile1', 'assets/images/monochrome_tilemap_packed.png', {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('player', 'assets/images/character_maleAdventurer_sheet.png', {frameWidth:96, frameHeight:128});
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
