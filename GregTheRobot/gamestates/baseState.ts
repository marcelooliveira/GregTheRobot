class BaseState extends Phaser.State {
    addText(x: number, y: number, text: string): Phaser.BitmapText {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'konami', text, 13.8);
    }
}
