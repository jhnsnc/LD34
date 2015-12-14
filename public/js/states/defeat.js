var defeatState = function(game) {};

(function() {
  defeatState.prototype = {
    //var displayElements;

    create: function() {
      console.log("Showing defeat screen");

      var txtTitle, txtTryAgain, btnStartGame, txtLvlAchieved;

      this.displayElements = this.game.add.group();
      this.displayElements.alpha = 0.0;

      //title
      txtTitle = createGameText({
        x: 540,
        y: 160,
        text: 'Defeat',
        fontSize: 80,
        strokeThickness: 8
      }, this);
      txtTitle.fontWeight = 700;
      txtTitle.anchor.setTo(0.5, 0.5);
      this.displayElements.add(txtTitle);

      //button
      btnStartGame = this.game.add.sprite(540, 330, "button-TryAgain");
      btnStartGame.anchor.setTo(0.5, 0.5);
      btnStartGame.inputEnabled = true;
      btnStartGame.input.useHandCursor = true;
      btnStartGame.events.onInputDown.add(this.backToTitle, this);
      this.displayElements.add(btnStartGame);

      //level achieved text
      txtLvlAchieved = createGameText({
        x: 540,
        y: 525,
        text: 'level reached: ' + this.game.level,
        fontSize: 30,
        strokeThickness: 8
      }, this);
      txtLvlAchieved.fontWeight = 300;
      txtLvlAchieved.anchor.setTo(0.5, 0.5);
      this.displayElements.add(txtLvlAchieved);

      //fade in elements
      this.game.add.tween(this.displayElements)
        .to({
          alpha: 1.0
        }, 1250, Phaser.Easing.Sinusoidal.InOut, true);

      //fullscreen toggle
      createFullscreenToggle(this);
    },
    backToTitle: function(sprite, pointer) {
      this.game.add.tween(this.displayElements)
        .to({
          alpha: 0.0
        }, 500, Phaser.Easing.Sinusoidal.Out, true)
        .onComplete.add(function() {
          this.game.state.start("Intro");
        }, this);
    }
  };
})();
