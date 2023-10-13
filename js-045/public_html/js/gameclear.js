// スタート画面のシーン
var gameclearscene = new Phaser.Scene("gameclearscene");

gameclearscene.create = function () {
    this.gameclear= this.add.image(400, 300, 'gameclear');
    this.gameclear.setDisplaySize(300,300);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
