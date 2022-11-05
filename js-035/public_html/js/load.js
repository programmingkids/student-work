// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
    // スタート画像
    this.load.image('gamestart', 'assets/images/gamestart.gif');
    // ゲームオーバー画像
    this.load.image('gameover', 'assets/images/gameover.png');
    
    this.load.image( 'background01','assets/images/backgroundCastles.png');
    
    this.load.image( 'player','assets/images/type_zero21_an.gif');
    
    this.load.image( 'enemy01','assets/images/type_zero_anf.gif');
    
    this.load.image( 'beam01','assets/images/beam01.png' );
    this.load.image( 'enemy02','assets/images/f-15j.gif');
    this.load.image( 'enemy03','assets/images/uav.gif');
    
    this.load.image( 'clear01','assets/images/Text-greeting-8.png');
    
    this.load.image( 'background02','assets/images/utyuu.jpg');
    
    this.load.image( 'player02','assets/images/spaceship.png');
    
    this.load.image( 'enemy04','assets/images/spaceStation_021.png');
    
    this.load.image( 'Meteo' ,'assets/images/meteo.png');
    
    this.load.image( 'flash01','assets/images/flash01.png');
    
    this.load.image( 'enemy05','assets/images/space-shuttle_2.gif');
    
    this.load.image( 'enemy06','assets/images/ufo_9.gif');
    
    this.load.image( 'beam05','assets/images/beam02.png');
    
    this.load.image( 'item01','assets/images/space_food.png');
    
    this.load.image( 'item02','assets/images/tonkachi.png');
    
};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
