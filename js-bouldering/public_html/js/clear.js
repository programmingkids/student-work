// clear画面のシーン
var clearScene = new Phaser.Scene("clearScene");

clearScene.create = function (data) {
    this.cameras.main.setBackgroundColor('#ffccd5');
    this.add.text(325, 400, "Score:" + data.score + "/8",{
        font : "30px Open Sans",
        fill : "#2b2b2b",
    });
    this.gameclear = this.add.image(400, 300, 'gameclear');
    this.gameclear.setDisplaySize(800,600);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
