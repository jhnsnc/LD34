battleState.prototype.setupAudio = function() {
  var trackBase = new Phaser.Sound(this.game, 'track1_base');
  var trackPluck = new Phaser.Sound(this.game, 'track1_pluck');
  var trackPulse = new Phaser.Sound(this.game, 'track1_pulse');

  this.tracksObj = {
    base: trackBase,
    pluck: trackPluck,
    pulse: trackPulse
  }

  //  Being mp3 files these take time to decode, so we can't play them instantly
  //  Using setDecodedCallback we can be notified when they're ALL ready for use.
  //  The audio files could decode in ANY order, we can never be sure which it'll be.

  this.game.sound.setDecodedCallback([trackBase, trackPluck, trackPulse], this.startBattle, this);
};

battleState.prototype.startAllMusic = function() {
  this.tracksObj.base.play(undefined, 0, VOLUME, true);
  this.tracksObj.pluck.play(undefined, 0, MIN_VOLUME, true);
  this.tracksObj.pulse.play(undefined, 0, MIN_VOLUME, true);
};

battleState.prototype.fadeInSound = function(type) {
  switch(type) {
    case "A":
      //stop fade out
      if (this.tracksObj.pulse.fadeTween) {
        this.tracksObj.pulse.fadeTween.stop(true);
      }
      //fade in
      this.tracksObj.pulse.fadeTo(MUSIC_FADE_IN_TIME, VOLUME);
      //fade out other add-on tracks
      this.fadeOutSound("B");
      break;
    case "B":
      //stop fade out
      if (this.tracksObj.pluck.fadeTween) {
        this.tracksObj.pluck.fadeTween.stop(true);
      }
      //fade in
      this.tracksObj.pluck.fadeTo(MUSIC_FADE_IN_TIME, VOLUME);
      //fade out other add-on tracks
      this.fadeOutSound("A");
      break;
  }
};

battleState.prototype.fadeOutSound = function(type) {
  switch(type) {
    case "A":
      if (this.tracksObj.pulse.fadeTween) {
        this.tracksObj.pulse.fadeTween.stop();
      }
      this.tracksObj.pulse.fadeTo(MUSIC_FADE_OUT_TIME, MIN_VOLUME);
      break;
    case "B":
      if (this.tracksObj.pluck.fadeTween) {
        this.tracksObj.pluck.fadeTween.stop();
      }
      this.tracksObj.pluck.fadeTo(MUSIC_FADE_OUT_TIME, MIN_VOLUME);
      break;
  }
};

battleState.prototype.fadeAllMusic = function(fadeOutTime) {
  if (this.tracksObj.pulse.fadeTween) {
    this.tracksObj.pulse.fadeTween.stop();
  }
  this.tracksObj.pulse.fadeTo(fadeOutTime, 0.0);
  if (this.tracksObj.pluck.fadeTween) {
    this.tracksObj.pluck.fadeTween.stop();
  }
  this.tracksObj.pluck.fadeTo(fadeOutTime, 0.0);
  this.tracksObj.base.fadeTo(fadeOutTime, 0.0);
};
