// スタート画面のシーン
var startScene = new Phaser.Scene("startScene");

startScene.create = function () {
    this.gamestart = this.add.image(580, 350, 'gamestart');
    this.gamestart.setDisplaySize(300,300);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('mainScene');
    }, this);
};
