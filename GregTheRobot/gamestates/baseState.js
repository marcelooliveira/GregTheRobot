class BaseState extends Phaser.State {
    constructor() {
        super();
    }
    addText(x, y, text) {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'bitmapfont', text, 13.8);
    }
}
//# sourceMappingURL=basestate.js.map