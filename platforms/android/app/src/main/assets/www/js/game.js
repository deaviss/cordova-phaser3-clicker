import {gameScene} from './gameScenes/gameScene.js';
import {startingScene} from './gameScenes/startingScene.js'
import { clickerScene } from './gameScenes/clickerScene.js';
document.addEventListener('deviceready', function() {
  // our game's configuration
  let config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    scene: [clickerScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false
  };
  console.log('ready')
  let game = new Phaser.Game(config);
});


// create the game, and pass it the configuration

