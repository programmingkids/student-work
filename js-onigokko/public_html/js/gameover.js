// スタート画面のシーン
var gameOverScene = new Phaser.Scene("gameOverScene");

gameOverScene.create = function (data) {
    this.gamestart = this.add.image(400, 300, 'gameover');
    this.gamestart.setDisplaySize(300,300);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
    this.scoreText = this.add.text(300, 450, "Score: " + data.score, {
        font : "40px Open Sans",
        fill : "#ff0000",
    });
};
