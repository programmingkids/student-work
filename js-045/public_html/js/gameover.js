// スタート画面のシーン
var gameoverscene = new Phaser.Scene("gameoverscene");

gameoverscene.create = function () {
    this.gameover= this.add.image(400, 300, 'gameover');
    this.gameover.setDisplaySize(300,300);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
