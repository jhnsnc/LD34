var battleState = function(game) {};

(function() {

  battleState.prototype = {
    create: function() {
      console.log("Starting Battle");

      var i, j, r, x, h;
      var bgGroundHorizon, txtCurrentLevel;
      var bitmapData, grd;

      //misc init
      this.gameEnding = false;
      this.victoryOrDeath = false;
      this.chargeLevel = 0;
      this.enemies = [];

      // //ground horizon gradient
      // h = 65;
      // bitmapData = new Phaser.BitmapData(this.game, "bitmapData-GroundGradient", 1, h);
      // grd = bitmapData.context.createLinearGradient(0, 0, 1, h);
      // grd.addColorStop(0.00, "rgba(54,64,76,0.9)");
      // grd.addColorStop(1.00, "rgba(48,52,64,0.9)");
      // bitmapData.rect(0, 0, 1, h, grd);
      // bitmapData.generateTexture("bg-GroundGradient");
      // bgGroundHorizon = this.game.add.tileSprite(0, 600-h, 1080, h, "bg-GroundGradient");

      txtCurrentLevel = createGameText({
        x: 40,
        y: 60,
        text: 'Level: ' + this.game.level,
        fontSize: 30,
        strokeThickness: 8
      }, this);
      txtCurrentLevel.fontWeight = 300;
      txtCurrentLevel.anchor.setTo(0.0, 0.5);

      txtCurrentLevel = createGameText({
        x: 40,
        y: 100,
        text: '(' + this.game.difficulty + ')',
        fontSize: 24,
        strokeThickness: 8
      }, this);
      txtCurrentLevel.fontWeight = 300;
      txtCurrentLevel.anchor.setTo(0.0, 0.5);

      //player elements
      this.setupTurret();
      this.setupBases();

      //enemy elements
      this.setupEnemyFragments();

      //fade in cover graphic (white)
      this.introCover = this.game.add.graphics(0, 0);
      this.introCover.beginFill(0xffffff, 1.0);
      this.introCover.drawRect(0, 0, 1080, 600);
      this.introCover.endFill();
      this.introCover.alpha = 1.0;

      //fullscreen toggle
      createFullscreenToggle(this);

      //decode audio -- continue setup after decoded
      this.setupAudio();
    },
    update: function(evt) {
      var self = this;

      if (evt && evt.input && evt.input.mousePointer) {
        this.pointTurretTowards(evt.input.mousePointer.x, evt.input.mousePointer.y);
      }

      this.debrisEmitterA.forEachAlive(function(p){
        p.alpha= p.lifespan / self.debrisEmitterA.lifespan;
      });

      this.debrisEmitterB.forEachAlive(function(p){
        p.alpha= p.lifespan / self.debrisEmitterB.lifespan;
      });
    }
  };

  battleState.prototype.startBattle = function() {
    console.log("ALL READY -- START BATTLE!");

    var time;

    this.game.add.tween(this.introCover)
      .to({
        alpha: 0.0
      }, 2500, Phaser.Easing.Sinusoidal.InOut, true)
      .onComplete.add(function() {
        this.introCover.parent.removeChild(this.introCover);
      }, this);

    //interactivity
    this.setupKeyboardInput();

    //music
    this.startAllMusic();

    //timers
    //initial spawn timers
    this.spawnTimer1 = this.game.time.events.add(Math.random() * this.getEnemySpawnTime(1), this.spawnEnemy, this, 1);
    this.spawnTimer2 = this.game.time.events.add(Math.random() * this.getEnemySpawnTime(2), this.spawnEnemy, this, 2);
    this.spawnTimer3 = this.game.time.events.add(Math.random() * this.getEnemySpawnTime(3), this.spawnEnemy, this, 3);

    //victory condition timer
    time = LEVEL_DURATION_BASE + (LEVEL_DURATION_GROWTH * this.getEffectiveLevel());
    this.levelCompleteTimer = this.game.time.events.add(time, this.setupVictoryOrDeath, this);
  };

  battleState.prototype.startCharge = function(type) {
    this.fadeInSound(type);

    //timer
    if (this.chargeTimer) {
      this.game.time.events.remove(this.chargeTimer);
    }
    this.chargeTimer = this.game.time.events.loop(CHARGE_TIMING, this.tickCharge, this);

    //charge manipulation
    this.isCharging = true;
    this.chargeType = type;
    this.tickCharge(true); //resets charge
  };

  battleState.prototype.fireLaser = function(type) {
    this.fadeOutSound(type);

    //charge manipulation
    this.isCharging = false;
    this.resetChargeCircles(this.chargeType);
    if (this.chargeLevel > 0) {
      this.showLaser(this.chargeLevel - 1);
      this.checkEnemiesForLaserCollision(this.chargeLevel - 1);
    }
  };

  battleState.prototype.tickCharge = function(shouldReset) {
    if (this.isCharging) {
      if (shouldReset) {
        this.chargeLevel = 0;
      } else {
        if (this.ignoreNextChargeTick) {
          this.ignoreNextChargeTick = false;
        } else {
          this.chargeLevel += 1;
        }
      }
      if (this.chargeLevel < MAX_CHARGE) {
        this.fadeInChargeCircle(this.chargeType, this.chargeLevel);
        this.resetChargeCircles((this.chargeType == "A") ? "B" : "A");
      } else {
        this.chargeLevel = MAX_CHARGE;
      }
    }
  };

  battleState.prototype.beginGameOverSequence = function() {
    if (!this.gameEnding) {
      console.log("the player died - DEFEAT");

      var self = this;
      var gfxCover;

      //flag for input handlers
      this.gameEnding = true;

      //cancel enemy spawns
      this.cancelAllSpawnTimers();
      if (this.levelCompleteTimer) {
        this.game.time.events.remove(this.levelCompleteTimer);
      }

      //fade music
      this.fadeAllMusic(3500);

      //fade in cover graphic (purple)
      gfxCover = this.game.add.graphics(0, 0);
      gfxCover.beginFill(0x560279, 1.0);
      gfxCover.drawRect(0, 0, 1080, 600);
      gfxCover.endFill();
      gfxCover.alpha = 0.0;
      this.game.add.tween(gfxCover)
        .to({alpha: 1.0}, 3000, Phaser.Easing.Sinusoidal.Out, true, 1000);

      //fade in cover graphic (black)
      gfxCover = this.game.add.graphics(0, 0);
      gfxCover.beginFill(0x000000, 1.0);
      gfxCover.drawRect(0, 0, 1080, 600);
      gfxCover.endFill();
      gfxCover.alpha = 0.0;
      this.game.add.tween(gfxCover)
        .to({alpha: 1.0}, 1500, Phaser.Easing.Sinusoidal.Out, true, 2500)
        .onComplete.add(function() {
          self.game.state.start("Defeat");
        }, this);
    }
  };

  battleState.prototype.setupVictoryOrDeath = function() {
    console.log("level time is up - player must clear remaining enemies");

    this.victoryOrDeath = true;

    //cancel enemy spawns
    this.cancelAllSpawnTimers();
    if (this.levelCompleteTimer) {
      this.game.time.events.remove(this.levelCompleteTimer);
    }

    //check victory condition
    if (this.victoryOrDeath && this.enemies.length <= 0) {
      this.completeLevel();
    }
  };

  battleState.prototype.completeLevel = function() {
    if (!this.gameEnding) {
      console.log("the player survived - VICTORY");

      var self = this;
      var gfxCover;

      //flag for input handlers
      this.gameEnding = true;

      //cancel enemy spawns
      this.cancelAllSpawnTimers();
      if (this.levelCompleteTimer) {
        this.game.time.events.remove(this.levelCompleteTimer);
      }

      //fade music
      this.fadeAllMusic(3500);

      //fade in cover graphic (purple)
      gfxCover = this.game.add.graphics(0, 0);
      gfxCover.beginFill(0xffffff, 1.0);
      gfxCover.drawRect(0, 0, 1080, 600);
      gfxCover.endFill();
      gfxCover.alpha = 0.0;
      this.game.add.tween(gfxCover)
        .to({alpha: 1.0}, 3000, Phaser.Easing.Sinusoidal.Out, true, 1000);

      //fade in cover graphic (black)
      gfxCover = this.game.add.graphics(0, 0);
      gfxCover.beginFill(0x000000, 1.0);
      gfxCover.drawRect(0, 0, 1080, 600);
      gfxCover.endFill();
      gfxCover.alpha = 0.0;
      this.game.add.tween(gfxCover)
        .to({alpha: 1.0}, 1500, Phaser.Easing.Sinusoidal.Out, true, 2500)
        .onComplete.add(function() {
          self.game.state.start("Victory");
        }, this);
    }
  };

  battleState.prototype.cancelAllSpawnTimers = function() {
    if (this.spawnTimer1) {
      this.game.time.events.remove(this.spawnTimer1);
    }
    if (this.spawnTimer2) {
      this.game.time.events.remove(this.spawnTimer2);
    }
    if (this.spawnTimer3) {
      this.game.time.events.remove(this.spawnTimer3);
    }
  };

  battleState.prototype.getEffectiveLevel = function() {
    switch(this.game.difficulty) {
      case "demon":
        return this.game.level + 15;
        break;
      case "normal":
        return this.game.level + 10;
        break;
      case "easy":
        return this.game.level + 5;
        break;
      case "beginner":
      default:
        return this.game.level;
        break;
    }
  };

})();
