// スタート画面のシーン
var clearScene = new Phaser.Scene("clearScene");



clearScene.create = function () {
    //var cameraPositionX = this.cameras.main.mid
    var gameclearImage = this.add.image(400,300,'gameclear');
    gameclearImage.setDisplaySize(500,400);
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
