// スタート画面のシーン
var clearScene = new Phaser.Scene("clearScene");

clearScene.create = function () {
    this.clearimage = this.add.image(400, 300, 'clear01');
    this.clearimage.setDisplaySize( 600,500 );
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
