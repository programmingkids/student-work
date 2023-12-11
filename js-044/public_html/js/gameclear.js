// スタート画面のシーン
var gameclearScene = new Phaser.Scene("gameclearScene");

gameclearScene.create = function (data) {
    this.gameclear = this.add.image(400, 300, 'gameclear');
    this.gameclear.setDisplaySize(800,600);

    this.cameras.main.setBackgroundColor('#00ff00');
    // キーをクリックするとゲームスタート
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
    var scoreText = 'スコア:' + data.score;
    //画面右上に赤色テキスト表示
    this.text = this.add.text(620, 40, scoreText, {
        fontSize: '30px',
        fill: '#ff0000',
        fontStyle: 'bold'
    });
};
