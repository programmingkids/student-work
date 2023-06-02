/*
タンスの中にメモをぶち込む

*/
var secondScene = new Phaser.Scene("secondScene");

secondScene.preload = function() {
    // テキストエリアを表示するプラグインの導入
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url : 'js/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
};

//二次元ファイル
var mapdata2 = [
    ["black","white","black","white","black","white","black","white","black","tansu"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["kinko","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","gray","white","black","white","reba-"],
    ["black","white","black","white","black","white","black","white","black","white"],
    ["white","black","white","black","white","black","white","black","white","black"],
];

secondScene.create = function (data) {
    // 初期設定メソッド呼び出し
    this.config(data);
    
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
    this.input.keyboard.on('keydown-SPACE',this.checkSpece, this);
    this.input.keyboard.on('keydown', function (event) {
        //またはを表す[||]
        //count ==> 入力が何番目か
        //number ==> 入力したやつの全部
        if(this.player.mapX == 0 && this.player.mapY == 3 ){
            if( this.hasitem == 1){
                var key = event.key;
                if( key == 1 || key == 2 || key == 3 || key == 4 || key == 5 || key == 6 || key == 7 || key == 8 || key == 9 || key == 0 ){
                    this.count ++;
                    this.number += key;
                    this.showMessage(this.number);
                    if(this.count == 4){
                        if(this.number == "0321"){
                            //金庫があいた
                            this.showMessage("暗証番号が認証されたようだ");
                            this.showMessage("=====================");
                            this.showMessage("第二目標を達成しました");
                            this.showMessage("=====================");
                            this.showMessage("虫眼鏡を手に入れた。");
                            this.hasitem = 2;
                            this.showMessage("=====================");
                            this.showMessage("アイテムの詳しい説明は");
                            this.showMessage("スペースキーで見ることができます。");
                            this.showMessage("=====================");
                            this.showMessage("第三目標");
                            this.showMessage("床の違和感を探す");
                            this.showMessage("=====================");
                        }else{
                            //まちがえたー
                            this.showMessage("暗証番号が違うようだ");
                            this.showMessage("=====================");
                            this.count = 0;
                            this.number = "";
                        }
                    }else if ( key == "z" && this.hasitem == 1){
                        this.showMessage("入力がリセットされたようだ");
                        this.count = 0;
                        this.number = "";
                        this.showMessage("=====================");
                    }else if ( key == "z"){
                        this.showMessage("金庫がある。開けるには。");
                        this.showMessage("４桁の暗証番号が必要だ。");
                        this.showMessage("=====================");
                    }
                }
            }
        }
    },this);
    
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
    this.countText.setDepth(2);
    
};

secondScene.countup = function(){
    var now = new Date();
    this.diff = now.getTime()-this.starttime.getTime()+this.mainScenediff;
    var ms = Math.floor(this.diff);
    var sec = Math.floor(this.diff / 1000);
    this.countText.setText("時間: "+ sec + "秒" + new String(ms).slice(-3, -1));
};

secondScene.createmap = function (){
    // マップ作成
    //Y方向の繰り返し
    for( var y = 0; y < mapdata2.length; y++ ){
        //x方向の繰り返し
        for( var x = 0; x < mapdata2[y].length; x++){
            //マップの作成
            var mapImage = this.add.image(x * 64, y * 64, mapdata2[y][x])
            .setOrigin(0,0);
            //マップのサイズを変更
            mapImage.setDisplaySize(64,64);
            mapImage.setDepth(0);
        }
    }
};

secondScene.update = function() {
    
};

secondScene.drawPlayer = function() {
    // プレイヤー画像を移動して表示する
    this.player.setPosition(this.player.mapX * 64, this.player.mapY * 64);
};

secondScene.moveUp = function(event) {
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

secondScene.moveDown = function(event) {
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
};

secondScene.moveRight = function(event) {
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
};

secondScene.moveLeft = function(event) {
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

secondScene.checkMove = function(x, y) {
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

secondScene.config = function (data) {
    //0が持ってない
    this.haskey = 0;
    //同じく
    this.hasitem = 0;
    //暗証番号のやつ
    this.count = 0;
    this.number = "";
    this.mainScenediff = data.diff;
    this.starttime = new Date();
    this.diff = 0;
};

secondScene.checkZ = function(){
    //alert( "this is Z" );
    
    if(this.player.mapX == 9 && this.player.mapY == 0 ){
        if(this.haskey == 0 ){
            this.haskey = 1;
            var text = "タンスを開けてメモを手に入れた";
            this.showMessage(text);
            this.hasitem = 1;
            text = "=====================";
            this.showMessage(text);
            text = "第一目標を達成しました";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            text = "メモの内容はスペースキーで";
            this.showMessage(text);
            text = "確認できます。";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            text = "第二目標";
            this.showMessage(text);
            text = "金庫を開ける";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
        }else{
            /*text = "このタンスはもう開けたようだ。";
            this.showMessage(text);
            text = "メモの内容はスペースキーで";
            this.showMessage(text);
            text = "確認できます。";
            this.showMessage(text);
            text = "=====================";
            this.showMessage(text);
            */
        }
    }else if(this.player.mapX == 0 && this.player.mapY == 0){
            if( this.haskey == 2 ){
                text = "鍵を使って出口の扉を開けた";
                this.showMessage(text);
                text = "ゲームクリア！";
                this.showMessage(text);
                this.counttime.remove();
                this.timeEvent = this.time.addEvent({
                    delay:3000,
                    callback:this.gameclear,
                    loop:false,
                    callbackScope:this
                });
            }else{
                text = "扉がある";
                this.showMessage(text);
                text = "鍵がかかっているようだ。";
                this.showMessage(text);
                this.showMessage("=====================");
            
        }

    }else if( this.player.mapX == 5 && this.player.mapY == 7){
        if(this.hasitem == 2){
            this.showMessage("床を虫眼鏡で覗いた。");
            this.showMessage("よく見ると隙間がある。");
            this.showMessage("乾電池が入っていた。");
            this.showMessage("=====================");
            this.showMessage("乾電池を手に入れた");
            this.hasitem = 3;
            this.showMessage("=====================");
            this.showMessage("第三目標を達成しました");
            this.showMessage("=====================");
            this.showMessage("第四目標");
            this.showMessage("部屋を調べる");
            this.showMessage("=====================");
        }else{
            this.showMessage("床になにか違和感があるが、");
            this.showMessage("小さくてよく見えない。");
            this.showMessage("=====================");
        }
    }else if( this.player.mapX == 9 && this.player.mapY == 7){
        if(this.hasitem == 3){
            this.showMessage("スイッチに乾電池を入れた");
            this.showMessage("スイッチを押した。");
            this.showMessage("どこかの床が動いた音がした。");
            this.showMessage("=====================");
            mapdata2[9][9]="black+";
            this.hasitem = 4;
            this.createmap();
        }else{
            this.showMessage("スイッチがある。");
            this.showMessage("電池切れで動かないようだ。");
            this.showMessage("=====================");
        }
    }else if(this.player.mapX == 9 && this.player.mapY == 9 && this.hasitem == 4){
        this.showMessage("鍵を手に入れた");
        this.haskey = 2;
        this.showMessage("=====================");
        this.showMessage("第四目標を達成しました");
        this.showMessage("=====================");
        this.showMessage("最終目標");
        this.showMessage("出口に向かう");
        this.showMessage("=====================");
    }else{
        text = "床を調べてみた。";
        this.showMessage(text);
        text = "何もなかった。";
        this.showMessage(text);
        text = "=====================";
        this.showMessage(text);
        
    }
};

secondScene.checkSpece = function(){
    //反応あり
    //alert( "this is Space" );
    if(this.hasitem == 1){
        var text = "[タンスのメモ]";
        this.showMessage(text);
        text = "金庫の暗証番号は";
        this.showMessage(text);
        text = "「adcb」";
        this.showMessage(text);
        text = "ヒント";
        this.showMessage(text);
        text = "aは0 bは1 cは2 dは3になる。";
        this.showMessage(text);
        text = "=====================";
        this.showMessage(text);
    }else if(this.hasitem == 2){
        this.showMessage("[虫眼鏡]");
        this.showMessage("かなりよく見える虫眼鏡だ。");
        this.showMessage("細かい違和感まで");
        this.showMessage("探せそうだ。");
        this.showMessage("=====================");
    }else{
        text = "今はメモを持っていない";
        this.showMessage(text);
    }
};
secondScene.createPlayer = function() {
    
    // スプライト画像の表示
    this.player = this.add.sprite(600, 600, 'player');
    this.player.setDisplaySize(64,64);
    this.player.setOrigin(0,0);
    this.player.setDepth(1);
    // 最初のフレームを0番にする
    this.player.setFrame(0);
    
    this.player.mapX = 9;
    this.player.mapY = 9;
    
    this.drawPlayer();
    
    this.player.playermove = 0;
    
    var text = "========操作方法========";
    this.showMessage(text);
    text = "    矢印キーで移動します。";
    this.showMessage(text);
    text = "    Zキーで調べることができます。";
    this.showMessage(text);
    text = "New➡スペースキーでアイテムの内容を";
    this.showMessage(text);
    text = "         見ることができます。";
    this.showMessage(text);
    text = "=======最終目標========";
    this.showMessage(text);
    text = "    部屋から脱出すること";
    this.showMessage(text);
    text = "====================";
    this.showMessage(text);
    text = "第一目標";
    this.showMessage(text);
    text = "部屋を調べる";
    this.showMessage(text);
    text = "=====================";
    this.showMessage(text);
    
};

secondScene.createTextArea = function() {
    // メッセージエリア
    this.message = this.rexUI.add.textArea({
        x: 800,
        y: 250,
        width: 300,
        height: 450,
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

secondScene.showMessage = function(text) {
    this.player.playermove = 1;
    // メッセージに文字の追加
    this.message.appendText(text + "\n\n");
    // 自動的にテキストエリアの最下部にスクロール
    this.message.scrollToBottom();
    this.time.addEvent({
        delay: 500,
        callback: this.movereset,
        loop: false,
        callbackScope: this
    });
};

secondScene.gameclear = function(){
    //STARTシーンに戻る
    this.scene.start("clearScene",{
        "diff":this.diff
    });
    
};

secondScene.movereset = function(){
    this.player.playermove = 0;
};
