// スタート画面のシーン
var clearScene = new Phaser.Scene("clearScene");

clearScene.create = function (data) {
    this.gameclear = this.add.image(540, 350, 'gameclear');
    this.gameclear.setDisplaySize(1080,700);
    var diff = data.diff;
    var ms = Math.floor(diff);
    var sec = Math.floor(diff / 1000);

    this.countText = this.add.text(75, 400, '時間: ' + diff,{
        font:'150px Open Sans',
        fill:'#000000'
    });
    
    this.countText.setText("時間: "+ sec + "秒" + new String(ms).slice(-3, -1));
    
    // キーをクリックするとゲームスタート
    /*this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);*/
};
