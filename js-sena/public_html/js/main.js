var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#99CCFF');
    
    // 背景画像をタイルスプライトで設定
    this.background = this.add.tileSprite(0,0, 800, 600, 'background');
    this.background.setOrigin(0, 0);
    
    // パイク作成
    this.createPipeGroup();
    
    // プレイヤー作成
    this.createBird();
    
    // クリックで飛ぶ
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
    
    // UI作成
    this.createUI();
};

mainScene.update = function() {
    if(this.isGameOver) {
        return ;
    }

    // 背景画像の移動で横スクロールを演出
    this.background.tilePositionX += 2;
    
    // 下限なのでゲームオーバー
    if(this.bird.y > this.game.config.height - this.bird.displayHeight / 2) {
        this.lose();
    }
    
    // 上限なのでゲームオーバー
    if(this.bird.y < 0) {
        this.lose();
    }
    
    var pipes = this.pipeGroup.getChildren();
    for( var i in pipes ) {
        var pipe = pipes[i];
        // パイプが画面の左側に到達
        if(pipe.getBounds().right < 0){
            // パイプを一時変数に代入
            this.pipePool.push(pipe);
            // 一時変数が2個になったら、パイプを再設定
            if(this.pipePool.length == 2) {
                // 2個のパイプの位置と高さを再設定
                this.placePipes();
                // パイプが画面左に到達したのでスコアアップ
                this.updateScore(5);
            }
        }
    }
};

mainScene.config = function () {
    // ゲームオーバーフラグ
    this.isGameOver = false;
    // プレイヤーの重力
    this.birdGravity =  800;
    // プレイヤーの速度、実際にはパイプの速度
    this.birdSpeedX = -125;
    // プレイヤーのジャンプパワー
    this.birdFlapPower =  -300;
    
    // パイプのセット数
    this.pipeSetNumber = 4;
    // パイプ間の空間の幅（乱数の範囲）
    this.pipeHole = [100, 180];
    // パイプの最小高さ
    this.minPipeHeight =  200;
    // distance range from next pipe, in pixels
    // パイプの左右の距離（乱数の範囲）
    this.pipeDistance =  [250, 300];

    // スコア
    this.score = 0;
};

mainScene.createPipeGroup = function() {
    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];
    
    for(var i = 0; i < this.pipeSetNumber; i++){
        // 1個目の下向きパイプ作成
        var pipe_down = this.pipeGroup.create(0, 0, 'pipe_down');
        pipe_down.setDisplaySize(100, 500);
        this.pipePool.push(pipe_down);
        // 2個目の上向きパイプ作成
        var pipe_up = this.pipeGroup.create(0, 0, 'pipe_up');
        pipe_up.setDisplaySize(100, 500);
        this.pipePool.push(pipe_up);
        
        // 2個のパイプの位置、高さを設定
        this.placePipes();
    }
    // パイプを左方向に移動する
    this.pipeGroup.setVelocityX(this.birdSpeedX);
};

mainScene.hitBirdAndPipe = function() {
    // プレイヤーとパイプの衝突
    this.lose();
};

mainScene.createBird = function() {
    // プレイヤー作成
    this.bird = this.physics.add.sprite(80, this.game.config.height / 2, 'bird');
    this.bird.setDisplaySize(80,40);
    // プレイヤーに重力設定
    this.bird.body.gravity.y = this.birdGravity;
    // プレイヤーとパイプの衝突
    this.physics.add.collider(this.bird, this.pipeGroup, this.hitBirdAndPipe, null, this);
};

mainScene.flap = function() {
    // 飛ぶ
    this.bird.setVelocityY(this.birdFlapPower);
};

mainScene.createUI = function() {
    // スコア表示のUI作成
    this.scoreText = this.add.text(50, 50, "Score:" + this.score,{
        font : "30px Open Sans",
        fill : "#ff0000",
    });
};

mainScene.updateScore = function(score) {
    // スコア更新
    this.score += score;
    this.scoreText.setText("Score:" + this.score);
};

mainScene.placePipes = function() {
    var rightmost = this.getRightmostPipe();
    
    // パイプの空間の高さをランダムに設定
    var pipeHoleHeight = Phaser.Math.Between(this.pipeHole[0], this.pipeHole[1]);
    // パイプの空間のY座標
    var pipeHolePosition = Phaser.Math.Between(
        this.minPipeHeight + pipeHoleHeight / 2, 
        this.game.config.height - this.minPipeHeight - pipeHoleHeight / 2);
    
    // 1個目のパイプのX座標
    // 一番右側のパイプのX座標 + パイプの幅 + ランダム（pipeDistance[0] ~ pipeDistance[1]）
    var x = rightmost + this.pipePool[0].getBounds().width + Phaser.Math.Between(this.pipeDistance[0], this.pipeDistance[1]);
    this.pipePool[0].x = x;
    // 1個目のパイプのY座標
    var y1 = pipeHolePosition - pipeHoleHeight / 2;
    this.pipePool[0].y = y1;
    // 1個目のパイプは左下を起点に配置
    this.pipePool[0].setOrigin(0, 1);

    // 2個目のパイプのX座標
    this.pipePool[1].x = x;
    // 2個目のパイプのY座標
    var y2 = pipeHolePosition + pipeHoleHeight / 2;
    this.pipePool[1].y = y2;
    // 2個目のパイプは左上を起点に配置
    this.pipePool[1].setOrigin(0, 0);
    
    // 一時変数を空にする
    this.pipePool = [];
};

mainScene.getRightmostPipe = function() {
    var rightmostPipe = 0;
    var pipes = this.pipeGroup.getChildren();
    for ( var i in pipes ) {
        var pipe = pipes[i];
        rightmostPipe = Math.max(rightmostPipe, pipe.x);
    }
    return rightmostPipe;
};

mainScene.lose = function() {
    // 敗北処理
    // 物理エンジン停止
    this.physics.pause();
    // プレイヤーを赤色に変換
    this.bird.setTint(0xff0000);
    // プレイヤーの加速度を停止
    this.bird.setVelocity(0,0);
    // ゲームオーバーフラグを設定
    this.isGameOver = true;
    
    // ゲームオーバー処理
    this.time.addEvent({
        delay: 1000,
        callback: this.gameOver,
        loop: false,
        callbackScope: this,
    });    
};

mainScene.gameOver = function() {
    // ゲームオーバー処理
    // 現在のカメラの中心座標を取得
    var cameraPositionX = this.cameras.main.midPoint.x;
    var cameraPositionY = this.cameras.main.midPoint.y;
    // ゲームオーバー画像を画面中央に表示
    var gameoverImage = this.add.image(cameraPositionX, cameraPositionY, 'gameover');
    gameoverImage.setDisplaySize(500,400);
    // 何かキーをクリックするとゲーム再開
    this.input.keyboard.on('keydown', function(event) {
        this.scene.start('startScene');
    }, this);
};
