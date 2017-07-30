/// <reference path="../phaser/phaser.d.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />
/// <reference path="basestate.ts" />
class Menu extends BaseState {
    create() {
        this.game.add.sprite(0, 0, 'menu');
        //this.addText(11, 4, 'GREG THE ROBOT');
        this.addText(10, 12, '©CAELUM 2017');
        this.pushSpaceKey = this.addText(9, 16, 'PUSH SPACE KEY');
        this.startSound = this.game.add.audio('start');
        this.startSound.onStop.add(function () {
            this.game.state.start('splash1');
        }.bind(this));
    }
    update() {
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.pushSpaceKey.alpha = 0;
            this.game.add.tween(this.pushSpaceKey).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 50, true);
            this.startSound.play();
        }
    }
}
//# sourceMappingURL=menu.js.map