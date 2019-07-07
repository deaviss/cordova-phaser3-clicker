
export class startingScene extends Phaser.Scene {

  constructor () {
    super({ key: 'startingScene' })
  }

  create() {
    const playButton = this.add.text(this.sys.game.config.width / 2,
                                     this.sys.game.config.height / 2,
                                     "Play the game", { fill: '#0f0'})
    playButton.setInteractive();
    playButton.on('pointerdown', () => {
      this.scene.start('clickerScene');
      //this.scale.startFullscreen();
    })
  }

}
