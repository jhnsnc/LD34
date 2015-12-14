var preloadState = function(game) {};

(function() {
  preloadState.prototype = {
    preload: function() {
      var game = this.game;

      //Load the Google WebFont Loader script
      game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

      //player assets
      game.load.image("turret", "assets/player/turret.png");
      game.load.image("base", "assets/player/base.png");
      game.load.spritesheet("base", "assets/player/base-sprite.png", 360, 260);
      game.load.image("charge_ring_1_a", "assets/player/charge-ring-1-a.png");
      game.load.image("charge_ring_1_b", "assets/player/charge-ring-1-b.png");
      game.load.image("charge_ring_2_a", "assets/player/charge-ring-2-a.png");
      game.load.image("charge_ring_2_b", "assets/player/charge-ring-2-b.png");
      game.load.image("charge_ring_3_a", "assets/player/charge-ring-3-a.png");
      game.load.image("charge_ring_3_b", "assets/player/charge-ring-3-b.png");
      game.load.image("charge_ring_4_a", "assets/player/charge-ring-4-a.png");
      game.load.image("charge_ring_4_b", "assets/player/charge-ring-4-b.png");

      //enemy assets
      game.load.image("enemy_tier1_a", "assets/enemies/enemy-tier1-a.png");
      game.load.image("enemy_tier1_b", "assets/enemies/enemy-tier1-b.png");
      game.load.image("enemy_tier2_a", "assets/enemies/enemy-tier2-a.png");
      game.load.image("enemy_tier2_b", "assets/enemies/enemy-tier2-b.png");
      game.load.image("enemy_tier3_a", "assets/enemies/enemy-tier3-a.png");
      game.load.image("enemy_tier3_b", "assets/enemies/enemy-tier3-b.png");
      game.load.image("enemy_shield_a", "assets/enemies/enemy-shield-a.png");
      game.load.image("enemy_shield_b", "assets/enemies/enemy-shield-b.png");

      game.load.spritesheet("enemy_fragments_a", "assets/enemies/enemy-fragments-a.png", 96, 96);
      game.load.spritesheet("enemy_fragments_b", "assets/enemies/enemy-fragments-b.png", 96, 96);

      //ui elements
      game.load.image("ui-FullscreenToggle", "assets/ui/ui-fullscreen-toggle.png");
      game.load.image("button-TryAgain", "assets/ui/btn-try-again.png");
      game.load.image("button-Continue", "assets/ui/btn-continue.png");

      //audio
      game.load.audio("track1_base", "assets/audio/track1-base.mp3");
      game.load.audio("track1_pluck", "assets/audio/track1-pluck.mp3");
      game.load.audio("track1_pulse", "assets/audio/track1-pulse.mp3");
    },
    create: function() {
      console.log("Preloading game assets");

      this.game.time.events.add(Phaser.Timer.SECOND, this.launchTitle, this);
    },
    launchTitle: function() {
      this.game.state.start("Title");
    }
  };
})();
