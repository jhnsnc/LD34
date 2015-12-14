battleState.prototype.setupKeyboardInput = function() {
  var keyA, keyB;

  keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  keyA.onDown.add(this.handleKeyDown, this);
  keyA.onUp.add(this.handleKeyRelease, this);

  keyB = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  keyB.onDown.add(this.handleKeyDown, this);
  keyB.onUp.add(this.handleKeyRelease, this);
  keyB = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
  keyB.onDown.add(this.handleKeyDown, this);
  keyB.onUp.add(this.handleKeyRelease, this);
};

battleState.prototype.handleKeyDown = function(evt) {
  if (!this.gameEnding) {
    // console.log("key pressed: ", evt.keyCode);
    switch (evt.keyCode) {
      case 65:
        this.startCharge('A');
        break;
      case 70:
      case 83:
        this.startCharge('B');
        break;
    }
  }
};

battleState.prototype.handleKeyRelease = function(evt) {
  if (!this.gameEnding) {
    switch (evt.keyCode) {
      case 65:
        this.fireLaser('A');
        break;
      case 70:
      case 83:
        this.fireLaser('B');
        break;
    }
  }
};