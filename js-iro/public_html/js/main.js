/*
1面:チュートリアル的
2面:本気の(?)

*/
var mainScene = new Phaser.Scene("mainScene");

mainScene.preload = function() {
    // テキストエリアを表示するプラグインの導入
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url : 'js/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
};

//二次元ファイル
var mapdata = [
    ["black","white","black","white","black","white","black","white","black","tansu"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
];

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#646464');

    this.createmap();
    
    this.createTextArea();
    
    this.createPlayer();
    
    //this.createUI();
    
    // プレイヤー操作
    this.input.keyboard.on('keydown-UP',this.moveUp, this);
    this.input.keyboard.on('keydown-DOWN',this.moveDown, this);
    this.input.keyboard.on('keydown-RIGHT',this.moveRight, this);
    this.input.keyboard.on('keydown-LEFT',this.moveLeft, this);
    this.input.keyboard.on('keydown-Z',this.checkZ, this);
    
    this.counttime = this.time.addEvent({
       delay : 1,
       callback : this.countup,
       loop : true,
       callbackScope : this,
    });

    this.countText = this.add.text(700, 600, '時間: ' + this.diff,{
        font:'28px Open Sans',
        fill:'#000000'
    });
};
mainScene.countup = function(){
    var now = new Date();
    this.diff = now.getTime()-this.starttime.getTime();
    var ms = Math.floor(this.diff);
    var sec = Math.floor(this.diff / 1000);
    this.countText.setText("時間: "+ sec + "秒" + new String(ms).slice(-3, -1));
};

mainScene.createmap = function (){
    // マップ作成
    //Y方向の繰り返し
    for( var y = 0; y < mapdata.length; y++ ){
        //x方向の繰り返し
        for( var x = 0; x < mapdata[y].length; x++){
            //マップの作成
            var mapImage = this.add.image(x * 64, y * 64, mapdata[y][x])
            .setOrigin(0,0);
            //マップのサイズを変更
            mapImage.setDisplaySize(64,64);
        }
    }
};

mainScene.update = function() {
    
};

mainScene.drawPlayer = function() {
    // プレイヤー画像を移動して表示する
    this.player.setPosition(this.player.mapX * 64, this.player.mapY * 64);
};

mainScene.moveUp = function(event) {
    // プレイヤーが上に移動
    //プレイヤーの上方向の移動後のx座標とy座標
    var x = this.player.mapX;
    var y = this.player.mapY - 1;
    //移動できるかのチェック
    if( !this.checkMove(x, y)){
        //移動できない
        return false;
    }
    //上方向へ移動
    this.player.mapY -= 1;
    this.drawPlayer();
    this.player.setFrame(11);
    //モンスターのチェック
    //this.checkMonster();
};

mainScene.moveDown = function(event) {
    // プレイヤーが下に移動
    var x = this.player.mapX;
    var y = this.player.mapY + 1;
    //移動できるかのチェック
    if( !this.checkMove(x, y)){
        //移動できない
        return false;
    }
    //上方向へ移動
    this.player.mapY += 1;
    this.drawPlayer();
    this.player.setFrame(2);
    //モンスターのチェック
    //this.checkMonster();
};

mainScene.moveRight = function(event) {
    // プレイヤーが右に移動
    var x = this.player.mapX + 1;
    var y = this.player.mapY;
    //移動できるかのチェック
    if( !this.checkMove(x, y)){
        //移動できない
        return false;
    }
    //上方向へ移動
    this.player.mapX += 1;
    this.drawPlayer();
    this.player.setFrame(8);
    //モンスターのチェック
    //this.checkMonster();
};

mainScene.moveLeft = function(event) {
    // プレイヤーが左に移動
    var x = this.player.mapX - 1;
    var y = this.player.mapY;
    //移動できるかのチェック
    if( !this.checkMove(x, y)){
        //移動できない
        return false;
    }
    //上方向へ移動
    this.player.mapX -= 1;
    this.drawPlayer();
    this.player.setFrame(5);
};

mainScene.checkMove = function(x, y) {
    // マップの移動可能可否の確認
    if( x < 0 || x > 9){
        //x方向でシーンの外に出るので移動不可
        return false;
    }
    if( y < 0 || y > 9 ){
        //Y方向でシーンの外に出るので移動不可
        return false;
    }
    if( this.player.playermove == 1){
        return false;
    }
    //移動してOK
    return true;
};

mainScene.config = function () {
    //0が持ってない
    this.haskey = 0;
    this.starttime = new Date();
    this.diff = 0;
};

mainScene.checkZ = function(){
    //alert( "this is Z" );
    if(this.player.mapX == 9 && this.player.mapY == 0 ){
        if(this.haskey == 0 ){
            this.haskey = 1;
            var text = "タンスを開けた";
            this.showMessage(text);
            text = "出口の鍵を手に入れた。";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            text = "第一目標を達成しました";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            text = "最終目標";
            this.showMessage(text);
            text = "出口に向かう";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
        }
    }else if(this.player.mapX == 0 && this.player.mapY == 0){
        if( this.haskey == 1 ){
            
            text = "鍵を使って出口の扉を開けた";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            text = "最終目標を達成しました";
            this.showMessage(text);
            text = "次のステージへ進みます";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            this.counttime.remove();
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
                // スタートシーンを起動します
                this.gameclear();
            }, this);
        }else{
            text = "扉がある";
            this.showMessage(text);
            text = "鍵がかかっているようだ。";
            this.showMessage(text);
        }
    }else{
        text = "床を調べてみた。";
        this.showMessage(text);
        text = "何もなかった。";
        this.showMessage(text);
        text = "=====================";
        this.showMessage(text);
    }
};

mainScene.createPlayer = function() {
    
    // スプライト画像の表示
    this.player = this.add.sprite(600, 600, 'player');
    this.player.setDisplaySize(64,64);
    this.player.setOrigin(0,0);
    // 最初のフレームを0番にする
    this.player.setFrame(0);
    
    this.player.mapX = 9;
    this.player.mapY = 9;
    
    this.drawPlayer();
    
    this.player.playermove = 0;
    
    var text = "========操作方法========";
    this.showMessage(text);
    text = "矢印キーで移動します。";
    this.showMessage(text);
    text = "Zキーで調べることができます。";
    this.showMessage(text);
    text = "========最終目標========";
    this.showMessage(text);
    text = "部屋から脱出すること。";
    this.showMessage(text);
    text = "=======文章について=======";
    this.showMessage(text);
    text = "アイテムの入手や";
    this.showMessage(text);
    text = "調べた結果などを記録します。";
    this.showMessage(text);
    text = "=====ゲームをするうえで=====";
    this.showMessage(text);
    text = "毎回必ず右下からスタートします。";
    this.showMessage(text);
    text = "また、出口は毎回左上にあります。";
    this.showMessage(text);
    text = "=====================";
    this.showMessage(text);
    text = "では、楽しんでください！";
    this.showMessage(text);
    text = "=====================";
    this.showMessage(text);
    text = "第一目標";
    this.showMessage(text);
    text = "出口の鍵を手に入れる";
    this.showMessage(text);
    text = "=====================";
    this.showMessage(text);
};

mainScene.createTextArea = function() {
    // メッセージエリア
    this.message = this.rexUI.add.textArea({
        x: 850,
        y: 300,
        width: 300,
        height: 550,
        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0,0x000000),
        text: this.add.text(0,0, "",{
            font: '14px Open Sans',
            fill: '#ffffff'
        }),
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        },
        slider: {
            track: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10, 0xcccccc),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0xff0000),
        },
        scroller: true,
    });
    this.message.layout();
};

mainScene.showMessage = function(text) {
    this.player.playermove = 1;
    // メッセージに文字の追加
    this.message.appendText(text + "\n\n");
    // 自動的にテキストエリアの最下部にスクロール
    this.message.scrollToBottom();
    
    this.time.addEvent({
        delay: 250,
        callback: this.movereset,
        loop: false,
        callbackScope: this
    });
};

mainScene.gameclear = function(){
    //STARTシーンに戻る
    //this.scene.start("startScene");
    this.scene.start('secondScene',{
        "diff":this.diff
    });
};

mainScene.movereset = function(){
    this.player.playermove = 0;
};