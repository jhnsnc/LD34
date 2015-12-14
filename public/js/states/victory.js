var victoryState = function(game) {};

(function() {
  victoryState.prototype = {
    //var displayElements;

    create: function() {
      console.log("Showing victory screen");

      var txtTitle, txtLevel, btnStartGame;

      this.displayElements = this.game.add.group();
      this.displayElements.alpha = 0.0;

      //title
      txtTitle = createGameText({
        x: 540,
        y: 140,
        text: 'Victory!',
        fontSize: 80,
        strokeThickness: 8
      }, this);
      txtTitle.anchor.setTo(0.5, 0.5);
      this.displayElements.add(txtTitle);

      //new level
      txtLevel = createGameText({
        x: 540,
        y: 280,
        text: 'you survived level ' + (this.game.level) + '!',
        fontSize: 40,
        strokeThickness: 8
      }, this);
      txtLevel.anchor.setTo(0.5, 0.5);
      this.displayElements.add(txtLevel);
      txtLevel = createGameText({
        x: 540,
        y: 330,
        text: '(' + (this.game.difficulty) + ' difficulty)',
        fontSize: 40,
        strokeThickness: 8
      }, this);
      txtLevel.fontWeight = 300;
      txtLevel.anchor.setTo(0.5, 0.5);
      this.displayElements.add(txtLevel);

      //button
      btnStartGame = this.game.add.sprite(540, 450, "button-Continue");
      btnStartGame.anchor.setTo(0.5, 0.5);
      btnStartGame.inputEnabled = true;
      btnStartGame.input.useHandCursor = true;
      btnStartGame.events.onInputDown.add(this.beginNextBattle, this);
      this.displayElements.add(btnStartGame);

      //fade in elements
      this.game.add.tween(this.displayElements)
        .to({
          alpha: 1.0
        }, 1250, Phaser.Easing.Sinusoidal.InOut, true);

      //fullscreen toggle
      createFullscreenToggle(this);
    },
    beginNextBattle: function(sprite, pointer) {
      this.game.level += 1;
      console.log("starting level " + this.game.level + " on " + this.game.difficulty + " difficulty");

      this.game.add.tween(this.displayElements)
        .to({
          alpha: 0.0
        }, 500, Phaser.Easing.Sinusoidal.Out, true)
        .onComplete.add(function() {
          this.game.state.start("Battle");
        }, this);
    }
  };
})();
