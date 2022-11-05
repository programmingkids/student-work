var mainScene02 = new Phaser.Scene("mainScene02");

mainScene02.create = function () {
    // 初期設定メソッド呼び出し
    this.config();
    
    // 背景色の設定
   
    this.cameras.main.setBackgroundColor('#99CCFF');
     // メインシーン
    this.background = this.add.tileSprite( 0,0,800,600,'background02' );
    this.background.setOrigin(0,0,)
    this.createPlayer();
    this.createEnemyGroup(); 
    this.createEnemy02Group();
    this.createUFOGroup();
    this.createBeamGroup();
    this.createUI();
    this.createParticle();
    this.createMeteoGroup();
    this.createitemGroup();
    
};

mainScene02.update = function() {
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
   
    if( this.score == 300 && this.BossAlive == false ) {
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
        if( this.Boss.x  <= 100 ) {
            this.Boss.dx = -this.Boss.dx;
        }
        this.Boss.x += this.Boss.dx
        
        this.Boss.y += this.Boss.dy;
    }
   
   
};

mainScene02.config = function () {
    this.speedY = 300;
    this.speedX = 300;
    
    this.score = 0;
    this.playerHP = 5;
    this.isGameOver = false;
    this.speedy = 200;
 
    this.BossAlive = false;
    this.BossHP = 30;
};



mainScene02.createUFOGroup = function() {
    
    this.UFOGroup = this.physics.add.group();
    
    this.time.addEvent({
        delay: 500,
        callback: this.createUFO,
        loop: true,
        callbackScope: this
        
    });
    
    this.physics.add.overlap( this.UFOGroup,this.player,this.hitUFO,null,this);
    
};

mainScene02.createUFO = function() {
    var RandomPositionY = Phaser.Math.RND.between( -100,600 );
    var ufo = this.UFOGroup.create( -10,RandomPositionY,'enemy06');
    ufo.setDisplaySize( 80,80 );
    var RandomSpeedX = Phaser.Math.RND.between( 200,300 );
    var RandomSpeedY = Phaser.Math.RND.between(-200,250 );
    ufo.setVelocity( RandomSpeedX,RandomSpeedY );
    
};

mainScene02.createMeteoGroup =  function() {
    this.meteoGroup = this.physics.add.group();
    this.time.addEvent({
        delay: 5000,
        callback: this.createMeteo,
        loop: true,
        callbackScope: this
        
    });
    this.physics.add.overlap( this.meteoGroup,this.player,this.hitmeteo,null,this);
    
};

mainScene02.createMeteo = function() {
    var randomPositionYY = Phaser.Math.RND.between( 0,600 );
    
    var meteo = this.meteoGroup.create( -50,randomPositionYY,'Meteo');
    meteo.setDisplaySize( 100,100 );
    var speed_X = Phaser.Math.RND.between( 100,300 );
    var speed_Y = Phaser.Math.RND.between( -100,50 );
    meteo.setVelocity( speed_X,speed_Y );
    
    
};




mainScene02.createPlayer = function() {
    this.player = this.physics.add.image( 500,400,'player02');
    this.player.setCollideWorldBounds( true );
   
    this.player.setDisplaySize(50,50);
    this.player.setAngle( 90 );
    this.input.keyboard.on( 'keydown-SPACE',function( event ) {
        this.createBeam();
    },this);
    
    this.HPtext = this.add.text( 10,20,'HP' + this.playerHP,{
        font: '28px Open Sans',
        fill: '#ff0000'
    });
   
};

mainScene02.createEnemyGroup = function() {
    this.enemyGroup = this.physics.add.group();
  
    
    this.time.addEvent({
        delay: 1000,
        callback:this.createEnemy,
        loop: true,
        callbackScope: this
    });
     
    this.physics.add.overlap( this.player,this.enemyGroup,this.hitenemy,null,this ); 
};

mainScene02.createitemGroup = function() {
    this.itemGroup = this.physics.add.group();  
    
    this.time.addEvent({
        delay: 1000,
        callback: this.createitem,
        loop: true,
        callbackScope: this
    });
    this.physics.add.overlap( this.player,this.itemGroup,this.hitStar,null,this );
};

mainScene02.createitem = function() {
    var RandomPositiOnX = Phaser.Math.RND.between( 100,400 );
    var item = this.itemGroup.create( RandomPositiOnX,20,'item01');
    item.setDisplaySize( 50,50 );
    var RandomSPeedX = Phaser.Math.RND.between( 100,150 );
    var RandomSPeedY = Phaser.Math.RND.between( -100,50 );
    item.setVelocity( RandomSPeedX,RandomSPeedY );
}



mainScene02.createEnemy = function() {
    var randomPositionY = Phaser.Math.RND.between( 100,600 );
    var enemy = this.enemyGroup.create( -50,randomPositionY,'enemy04');
    enemy.setDisplaySize( 60,60 );
    enemy.setAngle(270);
    
        
    var speedX = Phaser.Math.RND.between( 200,100 );
    var speedY = Phaser.Math.RND.between( -100,100 );
    enemy.setVelocity( speedX,speedY );
};


mainScene02.createEnemy02Group = function() {
    this.enemy02Group = this.physics.add.group();
    this.time.addEvent({
        
        delay: 5000,
        callback: this.createEnemy02,
        loop: true,
        callbackScope: this
    });
    this.physics.add.overlap( this.player,this.enemy02Group,this.hitEnemy02,null,this);
    
    
};

mainScene02.createEnemy02 = function() {
    var RandomPositionY = Phaser.Math.RND.between( 100,600 );
    var  enemy02 = this.enemy02Group.create( -50,RandomPositionY,'enemy05');
    enemy02.setDisplaySize( 70,70 );
    enemy02.setAngle( 90 );
    var SpeedX = Phaser.Math.RND.between( 300,200 );
    var SpeedY = Phaser.Math.RND.between( -100,100 );
    enemy02.setVelocity( SpeedX,SpeedY );
};

mainScene02.createBoss = function() {
   
        
        this.Boss = this.physics.add.image(0,300,'enemy03');
        this.Boss.setCollideWorldBounds( true );
        this.Boss.setDisplaySize( 200,200 );
        this.Boss.setFlipX( true );
        this.Boss.dy = 8;
        this.Boss.dx = 9;
        this.createBeam02Group();
        
       
        this.physics.add.overlap( this.Boss,this.BeamGroup,this.hitBeam02,null,this );
    
};

mainScene02.createBeam02Group = function() {
    
    this.Beam02Group = this.physics.add.group();
    
    this.timeEvent = this.time.addEvent({
        delay: 500,
        callback: this.createBeam02,
        loop: true,
        callbackScope: this
    });
    this.physics.add.overlap( this.player,this.Beam02Group,this.hitBossBeam,null,this);
    
};
mainScene02.createBeam02 = function() {
    var Position_X = this.Boss.x;
    var Position_Y = this.Boss.y;
    
    var beam02 = this.Beam02Group.create( Position_X,Position_Y,'beam05');
    beam02.setVelocityX( 500 );
    beam02.setDisplaySize( 100,100 );
  
};


mainScene02.createBeamGroup = function() {
    
    this.BeamGroup = this.physics.add.group();  
    this.physics.add.overlap( this.BeamGroup,this.enemyGroup,this.hitBeam,null,this );
    this.physics.add.overlap( this.BeamGroup,this.enemy02Group,this.hitBeam,null,this );
    this.physics.add.overlap( this.BeamGroup,this.UFOGroup,this.hitBeam,null,this);
    
};

mainScene02.createBeam = function() {
    var positionX = this.player.x;
    var positionY = this.player.y;
    
    var beam = this.BeamGroup.create( positionX,positionY,'beam01');
    beam.setVelocityX( -400 );
};

mainScene02.hitBeam = function(beam,enemy,) {
    enemy.destroy();
    beam.destroy();
    this.score += 5;
    
    this.scoretext.setText( 'スコア:' + this.score );
};


mainScene02.createUI = function() {
  
  this.scoretext = this.add.text( 600,20,'スコア:' + this.score ,{
      font:'28px Open Sans',
      fill:'#ff0000'
  });
    
};

mainScene02.checkRemove = function() {
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

mainScene02.hitenemy = function(player,enemy) {
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
mainScene02.gameOver = function() {
    this.gameover = this.add.image( 400,300,'gameover');
    this.gameover.setDisplaySize( 500,500 );
    this.input.keyboard.on( 'keydown' , function( event ) {
        this.scene.start("startScene");
        
    },this);
};
 
mainScene02.gameClear = function() {
   this.scene.start( "clearScene" );
    
    
}

mainScene02.createParticle = function() {
    var particles = this.add.particles( 'flash01' );
    this.emitter = particles.createEmitter({
        speed:300,
        maxParticles: 20,
        blendMode: 'ADD',
        follow: this.player
    });
    this.emitter.stop();
};

mainScene02.hitEnemy02 = function(player,enemy02 ) {
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
mainScene02.hitBeam02 = function(boss,beam) {
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
mainScene02.hitmeteo = function( meteo,player ) {
    
    
    if( this.isGameOver) {
        return;
    }
    meteo.destroy();
    this.playerHP = 0;
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
mainScene02.hitUFO = function( player,ufo ) {
    
    if( this.isGameOver) {
        return;
    }
    ufo.destroy();
    this.playerHP -= 1;
    this.HPtext.setText( 'HP' + this.playerHP );
    if( this.playerHP <= 0 ) {
        this.isGameOver = true;
        
        this.emitter.start();
        this.player.setVisible(false);
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this
        });
    }
};

mainScene02.hitBossBeam = function( player,Beam02) {
    
    if( this.isGameOver ) {
        return;
    }
    
    Beam02.destroy();
    
    
    this.playerHP -= 2;
    this.HPtext.setText( 'HP' + this.playerHP );
    if( this.playerHP <= 0 ) {
        
        this.emitter.start();
        this.player.setVisible(false);
        this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this
        });
    }
};
mainScene02.hitStar = function(player,item) {
    item.destroy();
    this.playerHP += 5;
    this.HPtext.setText( 'HP' + this.playerHP );
    
};

