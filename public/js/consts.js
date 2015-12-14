var MUSIC_FADE_IN_TIME = 100;
var MUSIC_FADE_OUT_TIME = 600;
var VOLUME = 1.0;
var MIN_VOLUME = 0.01; //to prevent losing sound sync

var HALF_PI = Math.PI / 2;
var TURRET_ROTATION_LIMIT = HALF_PI / 3;

var MAX_CHARGE = 4;
var CHARGE_TIMING = 400.00; //every beat at 150bpm
var CHARGE_TWEEN_TIMING = 200;
var CHARGE_SCALE = 0.6;
var CHARGE_ROTATION_TIMING = 12800;

var BASE_DURABILITY = 4;

var COLOR_A = 0xdc0072; //0xdc0098; //0xEF0098;
var COLOR_B = 0x0054ef; //0x0078ef; //0x00A9EF;

var ENEMY_SPAWN_PADDING = 150;
var ENEMY_SCALE = 0.6;
var ENEMY_TYPES = [
  {
    spriteName: "enemy_tier1_a",
    maxHitsA: 1,
    maxHitsB: 0
  },
  {
    spriteName: "enemy_tier1_b",
    maxHitsA: 0,
    maxHitsB: 1
  },
  {
    spriteName: "enemy_tier2_a",
    maxHitsA: 2,
    maxHitsB: 0
  },
  {
    spriteName: "enemy_tier2_b",
    maxHitsA: 0,
    maxHitsB: 2
  },
  {
    spriteName: "enemy_tier3_a",
    maxHitsA: 3,
    maxHitsB: 0
  },
  {
    spriteName: "enemy_tier3_b",
    maxHitsA: 0,
    maxHitsB: 3
  }
];

var LEVEL_DURATION_BASE = 56000;
var LEVEL_DURATION_GROWTH = 2200;
var ENEMY_MIN_TIMING = 22000;
var ENEMY_MAX_TIMING = 27000;
var ENEMY_SPAWN_TIMING_BASE = 3000;
var ENEMY_SPAWN_TIMING_ESCALATION = 0.95;
var ENEMY_SPAWN_TIMING_X_ESCALATION = 0.08;
var ENEMY_SPAWN_SHIELD_BASE = 0.1;
var ENEMY_SPAWN_SHIELD_ESCALATION = 0.01;
