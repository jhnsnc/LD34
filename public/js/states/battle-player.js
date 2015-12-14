battleState.prototype.setupTurret = function() {
  var i, j, r;
  var chargeLevels, gfx, sprite, rotateTween;

  this.turretContainer = this.game.add.sprite(540, 540);

  this.turret = this.game.add.sprite(0, 0, "turret");
  // this.turretContainer.position.setTo(-100, -200);
  this.turret.scale.setTo(0.5, 0.5);
  this.turret.anchor.setTo(0.5, 0.75);

  this.charges = {};
  for (i = 0; i < 2; i += 1) {
    chargeLevels = [];
    for (j = 0; j < MAX_CHARGE; j += 1) {
      sprite = this.game.add.sprite(0, 0, "charge_ring_"+(j+1)+"_"+(i == 0 ? 'a' : 'b'));
      sprite.anchor.setTo(0.5, 0.5);
      sprite.alpha = 0.0;
      sprite.scale.setTo(0.3*CHARGE_SCALE, 0.3*CHARGE_SCALE);
      rotateTween = this.game.add.tween(sprite).to(
          { rotation: (j % 2 == 0 ? -1 : 1) * 2 * Math.PI },
          CHARGE_ROTATION_TIMING, //duration
          Phaser.Easing.Sinusoidal.InOut, //easing
          true //autoStart
        );
      rotateTween.onLoop.add(function(sprite, tween) {
        if (sprite.rotation > 0) {
          sprite.rotation -= Math.PI * 2;
        } else {
          sprite.rotation += Math.PI * 2;
        }
      });
      rotateTween.loop();
      chargeLevels.push({
        sprite: sprite,
        tween: undefined,
        scaleTween: undefined,
        rotateTween: rotateTween
      });
    }
    this.charges[i == 0 ? "A" : "B"] = chargeLevels;
  }

  this.lasers = {};
  for (i = 0; i < 2; i += 1) {
    chargeLevels = [];
    for (j = 0; j < MAX_CHARGE; j += 1) {
      r = 6 + (8 * j);
      gfx = new Phaser.Graphics(this.game, 0, 0);
      gfx.lineStyle(r, i == 0 ? COLOR_A : COLOR_B, 1.0);
      gfx.moveTo(0, 0);
      gfx.lineTo(0, -800);
      sprite = this.game.add.sprite(0, 0);
      sprite.anchor.setTo(0.5, 1.0);
      sprite.addChild(gfx);
      sprite.alpha = 0.0;
      chargeLevels.push({
        sprite: sprite,
        tween: undefined
      });
    }
    this.lasers[i == 0 ? "A" : "B"] = chargeLevels;
  }

  for (i = 0; i < 2; i += 1) {
    for (j = 0; j < MAX_CHARGE; j += 1) {
      this.turretContainer.addChild(this.lasers[i == 0 ? "A" : "B"][j].sprite);
    }
  }
  this.turretContainer.addChild(this.turret);
  for (i = 0; i < 2; i += 1) {
    for (j = 0; j < MAX_CHARGE; j += 1) {
      this.turretContainer.addChild(this.charges[i == 0 ? "A" : "B"][j].sprite);
    }
  }
};

battleState.prototype.setupBases = function() {
  var i;
  var sprite;

  this.bases = [];
  for (i = 0; i < 4; i += 1) {
    x = 140 + (180 * i) + (i >= 2 ? 260 : 0);
    sprite = this.game.add.sprite(x, 530, "base");
    sprite.scale.setTo(0.5, 0.5);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.animations.add('idle4', [0], 2, true);
    sprite.animations.add('idle3', [1], 2, true);
    sprite.animations.add('idle2', [2], 2, true);
    sprite.animations.add('idle1', [3], 2, true);
    sprite.animations.add('idle0', [4], 2, true);
    sprite.animations.add('damaged3', [0,1,0,1,0,1,0,1,0,1,0,1], 20, true);
    sprite.animations.add('damaged2', [1,2,1,2,1,2,1,2,1,2,1,2], 20, true);
    sprite.animations.add('damaged1', [2,3,2,3,2,3,2,3,2,3,2,3], 20, true);
    sprite.animations.add('damaged0', [3,4,3,4,3,4,3,4,3,4,3,4], 20, true);
    sprite.animations.play('idle4');
    this.bases.push({
      sprite: sprite,
      hits: BASE_DURABILITY
    });
  }
};

battleState.prototype.pointTurretTowards = function(x, y) {
  this.turret.rotation = Math.atan2(y - this.turretContainer.y, x - this.turretContainer.x) + HALF_PI;
};

battleState.prototype.fadeInChargeCircle = function(type, level) {
  //alpha tween
  if (this.charges[type][level].tween) {
    this.charges[type][level].tween.stop(true);
  }
  this.charges[type][level].tween = this.game.add.tween(
    this.charges[type][level].sprite).to(
      { alpha: 1.0 },
      CHARGE_TWEEN_TIMING, //duration
      "Quad.easeOut", //easing
      true //autoStart
  );

  //scale tween
  if (this.charges[type][level].scaleTween) {
    this.charges[type][level].scaleTween.stop(true);
  }
  this.charges[type][level].tween = this.game.add.tween(
    this.charges[type][level].sprite.scale).to(
      { x: CHARGE_SCALE, y: CHARGE_SCALE },
      CHARGE_TWEEN_TIMING, //duration
      "Back.easeOut", //easing
      true //autoStart
  );
};

battleState.prototype.resetChargeCircles = function(type) {
  var i, len, t;
  for (i = 0, len = MAX_CHARGE; i < len; i += 1) {
    //alpha tween
    if (this.charges[type][i].tween) {
      this.charges[type][i].tween.stop(true);
    }
    this.charges[type][i].tween = this.game.add.tween(
      this.charges[type][i].sprite).to(
        { alpha: 0.0 },
        CHARGE_TWEEN_TIMING / 2, //duration
        undefined, //easing
        true //autoStart
    );

    //scale tween
    if (this.charges[type][i].scaleTween) {
      this.charges[type][i].scaleTween.stop(true);
    }
    t = this.charges[type][i].sprite.scale.x * 0.7;
    this.charges[type][i].tween = this.game.add.tween(
      this.charges[type][i].sprite.scale).to(
        { x: t , y: t },
        CHARGE_TWEEN_TIMING / 2, //duration
        undefined, //easing
        true //autoStart
    );
  }
};

battleState.prototype.showLaser = function(level) {
  if (this.lasers[this.chargeType][level].tween) {
    this.lasers[this.chargeType][level].tween.stop(true);
  }
  this.lasers[this.chargeType][level].sprite.alpha = 1.0;
  this.lasers[this.chargeType][level].sprite.rotation = this.turret.rotation;
  this.lasers[this.chargeType][level].tween = this.game.add.tween(
    this.lasers[this.chargeType][level].sprite).to(
      { alpha: 0.0 },
      CHARGE_TWEEN_TIMING * 6, //duration
      "Quad.easeIn", //easing
      true //autoStart
  );
};

battleState.prototype.damageBase = function(targetBase) {
  var hasLiveBase, i;

  this.bases[targetBase].hits -= 1;

  if (this.bases[targetBase].hits <= 0) {
    this.bases[targetBase].hits = 0;
    this.game.add.tween(
      this.bases[targetBase].sprite).to(
        { alpha: 0.3 },
        2000, //duration
        "Quad.easeOut", //easing
        true //autoStart
    );
    this.bases[targetBase].sprite.alpha = 0.3;
  }

  this.bases[targetBase].sprite.animations.play('damaged'+this.bases[targetBase].hits, 12, false);

  //check defeat condition
  hasLiveBase = false;
  for (i = 0; i < this.bases.length; i += 1) {
    if (this.bases[i].hits > 0) {
      hasLiveBase = true;
      break;
    }
  }
  if (!hasLiveBase) {
    this.beginGameOverSequence();
  }
};
