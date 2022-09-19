// スタート画面のシーン
var gameClearScene = new Phaser.Scene("gameClearScene");

gameClearScene.create = function () {
    this.cameras.main.setBackgroundColor('#cccccc');

    // 画面右上に赤色でテキスト表示
    this.text = this.add.text(300, 250, "ゲームクリア", {
        fontSize: '30px',
        fill: '#0088ff',
        fontStyle: 'bold'
    });

    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
