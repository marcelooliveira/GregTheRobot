/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />
class TheEnd extends BaseState {
    create() {
        this.addText(12, 12, 'THE END');
        this.gameOverSound = this.game.add.audio('gameOver');
        this.gameOverSound.volume = 0;
        this.gameOverSound.onStop.add(function () {
            this.game.state.start('menu');
        }.bind(this));
        this.gameOverSound.play();
    }
}
//# sourceMappingURL=theEnd.js.map