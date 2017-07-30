/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />

class GameOver extends BaseState {
    gameOverSound: Phaser.Sound;

    create() {
        this.addText(12, 12, 'GAME OVER');
        this.gameOverSound = this.game.add.audio('gameOver');
        this.gameOverSound.onStop.add(function () {
            this.game.state.start('menu');
        }.bind(this));

        this.gameOverSound.play();
    }
}