class Menu extends Phaser.State {
    pushSpaceKey: Phaser.BitmapText;
    startSound: Phaser.Sound;
    create() {
        this.game.add.sprite(0, 0, 'menu');
        
        this.addText(11, 4, 'KNIGHTMARE');
        this.addText(10, 12, '©KONAMI 1986');
        this.pushSpaceKey = this.addText(9, 16, 'PUSH SPACE KEY');

        this.startSound = this.game.add.audio('start');
        this.startSound.onStop.add(function () {
            this.game.state.start('splash01');
        }.bind(this));
    }

    update() {
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.pushSpaceKey.alpha = 0;
            this.game.add.tween(this.pushSpaceKey).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 50, true);
            this.startSound.play();
        }
    }

    addText(x: number, y: number, text: string) : Phaser.BitmapText {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'konami', text, 13.8);
    }
}