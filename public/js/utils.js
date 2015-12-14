var createGameText = function(options, ctx) {
  var result;
  var defaults = {
    fill: '#ffffff',
    stroke: '#060606',
    strokeThickness: 5,
    fontSize: 30
  };

  options = _.extend(defaults, options);
  result = ctx.game.add.text(options.x, options.y, options.text, {
    fill: options.fill,
    stroke: options.stroke,
    strokeThickness: options.strokeThickness
  });
  result.font = 'Ubuntu';
  result.fontSize = options.fontSize;

  return result;
};

var createFullscreenToggle = function(ctx) {
  ctx.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  var result;

  result = ctx.game.add.sprite(960, 495, "ui-FullscreenToggle");
  result.inputEnabled = true;
  result.input.useHandCursor = true;
  result.events.onInputDown.add(toggleFullscreen, ctx);

  return result;
}

var toggleFullscreen = function(ctx) {
  if (ctx.game.scale.isFullScreen) {
    ctx.game.scale.stopFullScreen();
  } else {
    ctx.game.scale.startFullScreen(false);
  }
};

var intBetween = function(min, max) {
  return Math.floor((Math.random() * (max - min)) + min);
}

var disableEvents = function(element) {
  if (element.events) {
    element.events.onInputDown.removeAll();
  }
  if (element.input) {
    element.input.useHandCursor = false;
  }
  element.inputEnabled = false;
};
