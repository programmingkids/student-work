var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
   
    this.cameras.main.setBackgroundColor('#99CCFF');
     // メインシーン
    this.background = this.add.tileSprite( 0,0,800,600,'background01' );
    this.background.setOrigin(0,0,)
    
    this.createPlayer();
    this.createEnemyGroup(); 
    this.createEnemy02Group();
    this.createBeamGroup();
    this.createitemGroup();
    this.createUI();
    this.createParticle();
    
};

mainScene.update = function() {
    this.background.tilePositionX -= 1;
    if( this.isGameOver == true ) {
        return;
    }
   
    //プレイヤーの動き
    var cursors = this.input.keyboard.createCursorKeys();
    if( cursors.up.isDown ) {
        this.player.setVelocityY(-this.speedY);
    }
    else if( cursors.down.isDown ) {
        this.player.setVelocityY( this.speedY );
    }else  if( cursors.right.isDown ) {
        this.player.setVelocityX( this.speedX);
    }else if( cursors.left.isDown ) {
        this.player.setVelocityX( -this.speedX );
    }else{
        this.player.setVelocity( 0 );
    }
    
   this.checkRemove();
   
    if( this.score == 150 && this.BossAlive == false ) {
      this.createBoss();
      this.BossAlive = true;
    }
    if( this.BossAlive == true ) {
        if( this.Boss.y >= 500 ) {
            this.Boss.dy = -this.Boss.dy;
        }
        if( this.Boss.y <= 100 ) {
            this.Boss.dy = -this.Boss.dy;
        }
        if( this.Boss.x >= 500 ) {
            this.Boss.dx = -this.Boss.dx;
        }
        if( this.Boss.x <= 100 ) {
            this.Boss.dx = -this.Boss.dx;
        }
        this.Boss.x += this.Boss.dx;
        
        this.Boss.y += this.Boss.dy;
    }
   
   
};

mainScene.config = function () {
    this.speedY = 300;
    this.speedX = 300;
    
    this.score = 0;
    this.playerHP = 5;
    this.isGameOver = false;
    this.speedy = 200;
 
    this.BossAlive = false;
    this.BossHP = 20;
};




mainScene.createPlayer = function() {
    this.player = this.physics.add.image( 500,400,'player');
    this.player.setCollideWorldBounds( true );
   
    this.player.setDisplaySize(50,50);
    
    this.input.keyboard.on( 'keydown-SPACE',function( event ) {
        this.createBeam();
    },this);
    
    this.HPtext = this.add.text( 10,20,'HP' + this.playerHP,{
        font: '28px Open Sans',
        fill: '#ff0000'
    });
   
};

mainScene.createitemGroup = function() {
    this.ItemGroup = this.physics.add.group();  
    this.time.addEvent({
        delay: 1000,
        callback: this.createitem,
        loop: true,
        callbackScope: this,
    });
     this.physics.add.overlap( this.player,this.ItemGroup,this.hititem,null,this );
     this.physics.add.overlap( this.ItemGroup,this.enemyGroup,this.hititem01,null,this );
};

mainScene.createitem = function() {
  var RandomPositiOnY = Phaser.Math.RND.between( 0,550 );
  var item = this.ItemGroup.create( -50,RandomPositiOnY,'item02');
  item.setDisplaySize( 60,60 );
  var RandomSpeeDx = Phaser.Math.RND.between( 100,200 );
  var RandomSpeeDy = Phaser.Math.RND.between( 100,200 );
  item.setVelocity( RandomSpeeDx,RandomSpeeDy );
  
};

mainScene.createBeam02Group = function() {
    this.Beam02Group = this.physics.add.group();
    this.time.addEvent({
        delay: 500,
        callback:this.createBeam02,
        loop: true,
        callbackScope: this
        });
        this.physics.add.overlap( this.player,this.Beam02Group,this.hitBeam03,null,this);
};
mainScene.createBeam02 = function() {
    var PositionX = this.Boss.x;
    var PositionY = this.Boss.y;
    var beam02 = this.Beam02Group.create( PositionX,PositionY,'beam05');
    beam02.setDisplaySize( 50,50 );
    beam02.setVelocityX(100);
    beam02.setDisplaySize( 50,50 );
    
    
};
mainScene.createEnemyGroup = function() {
    this.enemyGroup = this.physics.add.group();
  
    
    this.time.addEvent({
        delay: 1000,
        callback:this.createEnemy,
        loop: true,
        callbackScope: this
    });
     
    this.physics.add.overlap( this.player,this.enemyGroup,this.hitenemy,null,this ); 
    
};

mainScene.createEnemy = function() {
    var randomPositionY = Phaser.Math.RND.between( 100,600 );
    var enemy = this.enemyGroup.create( -50,randomPositionY,'enemy01');
    enemy.setDisplaySize( 60,60 );
    enemy.setFlipX(true);
    
        
    var speedX = Phaser.Math.RND.between( 200,100 );
    var speedY = Phaser.Math.RND.between( -100,100 );
    enemy.setVelocity( speedX,speedY );
};


mainScene.createEnemy02Group = function() {
    this.enemy02Group = this.physics.add.group();
    this.time.addEvent({
        
        delay: 5000,
        callback: this.createEnemy02,
        loop: true,
        callbackScope: this
    });
    this.physics.add.overlap( this.player,this.enemy02Group,this.hitEnemy02,null,this);
   
    
};

mainScene.createEnemy02 = function() {
    var RandomPositionY = Phaser.Math.RND.between( 100,600 );
    var  enemy02 = this.enemy02Group.create( -50,RandomPositionY,'enemy02');
    enemy02.setDisplaySize( 70,70 );
    enemy02.setFlipX( true );
    var SpeedX = Phaser.Math.RND.between( 300,200 );
    var SpeedY = Phaser.Math.RND.between( -100,100 );
    enemy02.setVelocity( SpeedX,SpeedY );
};



mainScene.createBoss = function() {
   
        
        this.Boss = this.physics.add.image(0,300,'enemy03');
        this.Boss.setCollideWorldBounds( true );
        this.Boss.setDisplaySize( 200,200 );
        this.Boss.setFlipX( true );
        this.Boss.dy = 4;
        this.Boss.dx = 4;
        this.physics.add.overlap( this.Boss,this.BeamGroup,this.hitBeam02 ,null,this);
        this.createBeam02Group();
    
};



mainScene.createBeamGroup = function() {
    
    this.BeamGroup = this.physics.add.group();  
    this.physics.add.overlap( this.BeamGroup,this.enemyGroup,this.hitBeam,null,this );
    this.physics.add.overlap( this.BeamGroup,this.enemy02Group,this.hitBeam,null,this );
};

mainScene.createBeam = function() {
    var positionX = this.player.x;
    var positionY = this.player.y;
    
    var beam = this.BeamGroup.create( positionX,positionY,'beam01');
    beam.setVelocityX( -400 );
};

mainScene.hitBeam = function(beam,enemy,) {
    enemy.destroy();
    beam.destroy();
    this.score += 5;
    
    this.scoretext.setText( 'スコア:' + this.score );
};


mainScene.createUI = function() {
  
  this.scoretext = this.add.text( 600,20,'スコア:' + this.score ,{
      font:'28px Open Sans',
      fill:'#ff0000'
  });
    
};

mainScene.checkRemove = function() {
    var enemies = this.enemyGroup.getChildren();
    for( var i in enemies ) {
        if( enemies[i].x >= 800 ) {
        enemies[i].destroy();
        break;
        }
    }
    var beams = this.BeamGroup.getChildren();
    for( var b in beams ) {
        if( beams[b].x <= 0) {
            beams[b].destroy();
            break;
        }
    }
    
};

mainScene.hitenemy = function(player,enemy) {
    if( this.isGameOver) {
        return;
    }
    enemy.destroy();
    this.playerHP--;
    this.HPtext.setText( 'HP' + this.playerHP );
    if( this.playerHP <= 0 ) {
        
        this.isGameOver = true;
        
        this.emitter.start();
        this.player.setVisible( false );
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this
        });
    }
};
mainScene.gameOver = function() {
    this.gameover = this.add.image( 400,300,'gameover');
    this.gameover.setDisplaySize( 500,500 );
    this.input.keyboard.on( 'keydown' , function( event ) {
        this.scene.start("startScene");
        
    },this);
};

mainScene.gameClear = function() {
   this.scene.start( "mainScene02" );
    
    
}

mainScene.createParticle = function() {
    var particles = this.add.particles( 'flash01' );
    this.emitter = particles.createEmitter({
        speed:300,
        maxParticles: 20,
        blendMode: 'ADD',
        follow: this.player
    });
    this.emitter.stop();
};

mainScene.hitEnemy02 = function(player,enemy02 ) {
     if( this.isGameOver) {
        return;
    }
    enemy02.destroy();
    this.playerHP -= 2;
    this.HPtext.setText( 'HP' + this.playerHP );
    if( this.playerHP <= 0 ) {
        
        this.isGameOver = true;
        
        this.emitter.start();
        this.player.setVisible( false );
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this
        });
    }
};
mainScene.hitBeam02 = function(boss,beam) {
    if( this.isGameOver )　{
        return;
    }
    this.BossHP--;
    beam.destroy();
    this.score += 10;
    this.scoretext.setText( 'スコア:' + this.score );
    if( this.BossHP <= 0 ) {
        this.Boss.destroy();
        this.BossAlive = false;
        
        this.time.addEvent({
            
            delay:1000,
            callback: this.gameClear,
            loop: false,
            callbackScope: this
        });
    }
};    
    
mainScene.hitBeam03 = function(player,beam02) {
    
    if( this.isGameOver ) {
        return;
    }
    beam02.destroy();
    this.playerHP--;
    this.HPtext.setText( 'HP:' + this.playerHP );
    if( this.playerHP <= 0 ) {
        this.isGameOver = true;
        this.emitter.start();
        this.player.setVisible( false );
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this,
        });
    }
};

mainScene.hititem = function( player,item ) {
    
    if( this.isGameOver ) {
        return
    }
   
    item.destroy();
    this.playerHP -= 3;
    this.HPtext.setText ( 'HP' + this.playerHP );
    if( this.playerHP <= 0 ) {
       this.isGameOver = true;
       this.emitter.start();
       this.player.setVisible( false );
       this.time.addEvent({
           delay: 1000,
           callback: this.gameOver,
           callbackScope: this,
       });
    }
};

mainScene.hititem01 = function(item,enemy) {
    enemy.destroy();
    item.destroy();
};