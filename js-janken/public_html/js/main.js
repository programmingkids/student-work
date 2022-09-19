var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // UI
    this.createUI();
    // プレイヤー
    this.createPlayer();
    // 初回じゃんけん開始
    this.jankenpon();
};

mainScene.update = function() {
    
};

mainScene.config = function () {
    // プレイヤー画像配列
    this.playerHands = [];
    // プレイヤーの手
    this.playerHand = ["gu", "choki", "pa"];
    // コンピュータの手
    this.computerHand = ["gu", "choki", "pa"];
    // 結果のテキスト
    this.results = ["あいこ","勝ち", "負け"];
    // 掛け声インデックス
    this.kakegoeIndex = 0;
    
    // 結果配列
    this.score = [0,0,0];
    // 結果テキスト配列
    this.scoreText = [];
};

mainScene.createUI = function() {
    this.resultText = this.add.text(360, 280, "",{
        font : "30px Open Sans",
        fill : "#ff0000",
    });
    
    this.kakegoeText = this.add.text(100, 150, "", {
        font : "200px Open Sans",
        fill : "#0000ff",
    });
    
    this.scoreText.push(this.add.text(30, 50, "", {
        font : "30px Open Sans",
        fill : "#00ff00",
    }));
    this.scoreText.push(this.add.text(250, 50, "", {
        font : "30px Open Sans",
        fill : "#0000ff",
    }));
    this.scoreText.push(this.add.text(420, 50, "", {
        font : "30px Open Sans",
        fill : "#ff0000",
    }));
    
    this.winRateText= this.add.text(580, 50, "", {
        font : "30px Open Sans",
        fill : "#000000",
    });
    
    this.buttonRestart = this.add.image(400, 530, 'button_restart');
    this.buttonRestart.setInteractive({
            useHandCursor: true,
    });
    this.buttonRestart.on('pointerdown', function(){
        this.jankenpon();
    }, this);
    this.buttonRestart.setVisible(false);
};


mainScene.createPlayer = function() {
    for(var i in this.playerHand) {
        var value = this.playerHand[i];
        var index = parseInt(i, 10);
        var hand = this.add.image(index * 200 + 200, 400, value);
        hand.setDisplaySize(100, 100);
        hand.setInteractive({
            useHandCursor: true,
        });
        
        (function(index, context) {
            hand.on("pointerdown", function() {
                this.pon(index);
            }, context);
        }(index, this));
        
        this.playerHands.push(hand);
    }
};

mainScene.disablePlayerHand = function() {
    for( var i in this.playerHands) {
        var hand = this.playerHands[i];
        hand.disableInteractive();
        hand.setTint(0xcccccc);
    }
};

mainScene.enablePlayerHand = function() {
    for( var i in this.playerHands) {
        var hand = this.playerHands[i];
        hand.setInteractive();
        hand.clearTint();
    }
};

mainScene.jankenpon = function() {
    this.resultText.setText("");
    this.disablePlayerHand();
    this.kakegoeIndex = 0;
    this.buttonRestart.setVisible(false);
    if(this.computerHandImage != null) {
        this.computerHandImage.destroy();
    }
    this.kakegoeTimer = this.time.addEvent({
        delay: 700,
        loop : true,
        callback : this.kakegoe,
        callbackScope : this,
    });
};

mainScene.kakegoe = function() {
    if( this.kakegoeIndex == 3 ) {
        this.kakegoeTimer.remove();
        this.kakegoeText.setText("");
        this.enablePlayerHand();
        return;
    }
    switch (this.kakegoeIndex) {
        case 0 :
            this.kakegoeText.setText("じゃん");
            break;
        case 1 :
            this.kakegoeText.setText("  けん");
            break;
        case 2 :
            this.kakegoeText.setText("  ぽん");
            break;
    }
    this.kakegoeIndex++;
};

mainScene.pon = function(index) {
    if(this.computerHandImage != null) {
        this.computerHandImage.destroy();
    }
    
    var computerHand = Phaser.Math.RND.between(0, 2);
    this.computerHandImage = this.add.image(400, 200, this.computerHand[computerHand]);
    this.computerHandImage.setDisplaySize(100, 100);
    
    // 0 => 引き分け
    // 1 => プレイヤー勝ち
    // 2 => プレイヤー負け
    var result = (computerHand - index + 3) % 3;
    // 結果表示
    this.resultText.setText(this.results[result]);
    this.score[result]++;
    this.afterPon(index);
};

mainScene.afterPon = function(index) {
    this.disablePlayerHand();
    var hand = this.playerHands[index];
    hand.setTint(0xfcb0f8);
    this.showScore();
    this.buttonRestart.setVisible(true);
};

mainScene.showScore = function() {
    var total = 0;
    for( var i in this.scoreText) {
        total += this.score[i];
        var text = this.scoreText[i];
        if( i == 0 ) {
            text.setText("引き分け：" + this.score[i]);
        } else if( i == 1 ) {
            text.setText("勝ち：" + this.score[i]);
        } else if( i == 2 ) {
            text.setText("負け：" + this.score[i]);
        }
    }
    var winRate = round(this.score[1] / total * 100, 1);
    this.winRateText.setText("勝率：" + winRate + "%");
};

function round( num, digit ) {
  var digitVal = Math.pow( 10, digit );
  return Math.round( num * digitVal ) / digitVal;
}
