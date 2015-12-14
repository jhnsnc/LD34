battleState.prototype.setupEnemyFragments = function() {
  this.debrisEmitterA = this.game.add.emitter();
  this.debrisEmitterA.makeParticles('enemy_fragments_a', [0,1,2,3,4]);
  this.debrisEmitterA.lifespan = 450;
  this.debrisEmitterA.setRotation(-150, 150);
  this.debrisEmitterA.setScale(0.25, 0.5, 0.25, 0.5);
  this.debrisEmitterA.setXSpeed(-350, 350);
  this.debrisEmitterA.setYSpeed(-350, 350);

  this.debrisEmitterB = this.game.add.emitter();
  this.debrisEmitterB.makeParticles('enemy_fragments_b', [0,1,2,3,4]);
  this.debrisEmitterB.lifespan = 450;
  this.debrisEmitterB.setRotation(-150, 150);
  this.debrisEmitterB.setScale(0.25, 0.5, 0.25, 0.5);
  this.debrisEmitterB.setXSpeed(-350, 350);
  this.debrisEmitterB.setYSpeed(-350, 350);
};

battleState.prototype.emitDebris = function(x, y, type, count) {
  this["debrisEmitter"+type].x = x;
  this["debrisEmitter"+type].y = y;

  this["debrisEmitter"+type].explode(450, count*4 + Math.floor(Math.random() * 6));
};

battleState.prototype.spawnEnemy = function(spawnerNumber) {
  if (!this.gameEnding) {
    //add enemy
    this.enemies.push(this.createNewEnemy());

    //refresh timer
    if (this["spawnTimer"+spawnerNumber]) {
      this.game.time.events.remove(this["spawnTimer"+spawnerNumber]);
    }
    this["spawnTimer"+spawnerNumber] = this.game.time.events.add(this.getEnemySpawnTime(spawnerNumber), this.spawnEnemy, this, spawnerNumber);
  }
};

battleState.prototype.getEnemySpawnTime = function(spawnerNumber) {
  var baseMult = Math.pow(ENEMY_SPAWN_TIMING_ESCALATION, this.getEffectiveLevel());
  var time, r;

  switch(spawnerNumber) {
    case 1:
      time = 2.0 * baseMult * ENEMY_SPAWN_TIMING_BASE;
      break;
    case 2:
      time = 2.2 * baseMult * ENEMY_SPAWN_TIMING_BASE;
      break;
    case 3:
      r = Math.max(0.5, 2.2 + (2.0 - (this.getEffectiveLevel() * ENEMY_SPAWN_TIMING_X_ESCALATION)));
      time = r * baseMult * ENEMY_SPAWN_TIMING_BASE;
      break;
  }

  //variance (+/-10%)
  r = (Math.random() * 0.2) - 0.1; // -0.1 to 0.1
  time = time + (time * r);

  return time;
};

battleState.prototype.createNewEnemy = function() {
  var enemy = {};
  var r, standingBases, i, enemyTypeIdx;
  var type;

  //reroll type
  r = Math.floor(Math.random() * ENEMY_TYPES.length);
  enemyTypeIdx = r;
  enemy.sprite = this.game.add.sprite(0, 0, ENEMY_TYPES[enemyTypeIdx].spriteName);
  enemy.sprite.anchor.setTo(0.5, 0.5);
  enemy.sprite.scale.setTo(ENEMY_SCALE, ENEMY_SCALE);

  //roll for chance to have shield
  r = Math.random();
  if (r < ENEMY_SPAWN_SHIELD_BASE + (ENEMY_SPAWN_SHIELD_ESCALATION * this.getEffectiveLevel())) {
    //has shield
    r = Math.floor(Math.random() * 2);
    if (r == 0) {
      //type A
      enemy.hasShield = "A";
    } else {
      //type B
      enemy.hasShield = "B";
    }
    enemy.shieldSprite = this.game.add.sprite(0, 0, "enemy_shield_"+(enemy.hasShield == "A" ? "a" : "b"));
    enemy.shieldSprite.anchor.setTo(0.5, 0.5);
    enemy.sprite.addChild(enemy.shieldSprite);
  } else {
    //no shield
    enemy.hasShield = false;
  }

  //combat stats
  enemy.hitsA = ENEMY_TYPES[enemyTypeIdx].maxHitsA;
  enemy.hitsB = ENEMY_TYPES[enemyTypeIdx].maxHitsB;

  //set start position
  r = (Math.random() * (1080 - (ENEMY_SPAWN_PADDING * 2))) + ENEMY_SPAWN_PADDING;
  enemy.sprite.position.setTo(r, 0);

  //set end position
  standingBases = [];
  for (i = 0; i < this.bases.length; i += 1) {
    if (this.bases[i].hits > 0) {
      standingBases.push(i);
    }
  }
  r = Math.floor(Math.random() * standingBases.length);
  enemy.targetBase = standingBases[r];

  //set time til collision and detonation timer
  r = (Math.random() * (ENEMY_MAX_TIMING - ENEMY_MIN_TIMING)) + ENEMY_MIN_TIMING
  enemy.timeTilCollision = r;
  enemy.detonationTimer = this.game.time.events.add(enemy.timeTilCollision, this.detonateEnemy, this, enemy);

  //setup tween
  enemy.sprite.rotation = Math.atan2(enemy.sprite.y - this.bases[enemy.targetBase].sprite.position.y, enemy.sprite.x - this.bases[enemy.targetBase].sprite.position.x) + HALF_PI;
  enemy.tween = this.game.add.tween(
    enemy.sprite).to(
      {
        x: this.bases[enemy.targetBase].sprite.position.x,
        y: this.bases[enemy.targetBase].sprite.position.y
      },
      enemy.timeTilCollision, //duration
      undefined, //easing
      true //autoStart
    );
  enemy.tween.onComplete.add(this.handleEnemyMovementComplete, this);

  return enemy;
};

battleState.prototype.handleEnemyMovementComplete = function(sprite, tween) {
  var i;

  for (i = 0; i < this.enemies.length; i += 1) {
    if (this.enemies[i].sprite === sprite) {
      this.detonateEnemy(this.enemies[i]);
      break;
    }
  }
};

battleState.prototype.detonateEnemy = function(enemy) {
  this.damageBase(enemy.targetBase);

  //remove enemy
  enemy = this.enemies.splice(this.enemies.indexOf(enemy), 1)[0];
  if (enemy.tween && typeof enemy.tween === 'function') {
    enemy.tween.stop();
  }
  enemy.sprite.parent.removeChild(enemy.sprite);
  if (enemy.detonationTimer) {
    this.game.time.events.remove(enemy.detonationTimer);
  }

  //check victory condition
  if (this.enemies.length <= 0) {
    this.completeLevel();
  }
};

battleState.prototype.checkEnemiesForLaserCollision = function(level) {
  var pt, deg, x1, y1, x2, y2;
  var i, dist, diffX, diffY;
  var proximityLimit;
  var enemy;
  var enemyType;

  pt = this.lasers[this.chargeType][level].sprite.worldPosition;
  x1 = pt.x;
  y1 = pt.y;

  deg = this.lasers[this.chargeType][level].sprite.rotation + HALF_PI;
  x2 = x1 - (800 * Math.cos(deg));
  y2 = y1 - (800 * Math.sin(deg));

  //for evaluating if laser is close enough to hit
  proximityLimit = (6 + (8 * level)) + (48 * ENEMY_SCALE);

  for (i = 0; i < this.enemies.length; i += 1) {
    diffX = x2 - x1;
    diffY = y2 - y1;

    dist = Math.abs( (diffY * this.enemies[i].sprite.position.x) - (diffX * this.enemies[i].sprite.position.y) + (x2 * y1) - (y2 * x1) );
    dist /= Math.sqrt((diffY * diffY) + (diffX * diffX));

    if (dist < proximityLimit ) {
      //collision!
      //take damage
      //shield first
      if (this.enemies[i].hasShield) {
        //shield takes hit
        //only remove if it matches the laser type
        if (this.chargeType === this.enemies[i].hasShield) {
          this.enemies[i].sprite.removeChild(this.enemies[i].shieldSprite);
          this.emitDebris(this.enemies[i].sprite.x, this.enemies[i].sprite.y, this.enemies[i].hasShield, 2);
          this.enemies[i].hasShield = false;
        }
      } else {
        //no shield -- take damage
        if (this.enemies[i].hitsA > 0) {
          enemyType = "A";
        } else {
          enemyType = "B";
        }
        if (this.enemies[i]["hits" + this.chargeType] > 0) {
          this.enemies[i]["hits" + this.chargeType] -= (level + 1);
          this.emitDebris(this.enemies[i].sprite.x, this.enemies[i].sprite.y, this.chargeType, Math.min(level + 1, this.enemies[i]["hits" + this.chargeType]));
        }
      }
      //if destroyed, explode
      if (this.enemies[i]["hitsA"] <= 0 && this.enemies[i]["hitsB"] <= 0) {
        enemy = this.enemies.splice(i, 1)[0];
        enemy.tween.stop();

        this.emitDebris(enemy.sprite.x, enemy.sprite.y, enemyType, 3);

        enemy.sprite.parent.removeChild(enemy.sprite);
        if (enemy.detonationTimer) {
          this.game.time.events.remove(enemy.detonationTimer);
        }
        i -= 1;
        //check victory condition
        if (this.victoryOrDeath && this.enemies.length <= 0) {
          this.completeLevel();
        }
      }
    }
  }
};
