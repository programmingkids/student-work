// スタート画面のシーン
var gameoverScene = new Phaser.Scene("gameoverScene");

gameoverScene.create = function (data) {
    this.gameover = this.add.image(400, 300, 'gameover');
    this.gameover.setDisplaySize(800,600);
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
