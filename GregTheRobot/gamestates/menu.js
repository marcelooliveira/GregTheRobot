var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Menu.prototype.create = function () {
        this.game.add.sprite(0, 0, 'menu');
        this.addText(11, 4, 'KNIGHTMARE');
        this.addText(10, 12, '©KONAMI 1986');
        this.pushSpaceKey = this.addText(9, 16, 'PUSH SPACE KEY');
        this.startSound = this.game.add.audio('start');
        this.startSound.onStop.add(function () {
            this.game.state.start('splash01');
        }.bind(this));
    };
    Menu.prototype.update = function () {
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.pushSpaceKey.alpha = 0;
            this.game.add.tween(this.pushSpaceKey).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 50, true);
            this.startSound.play();
        }
    };
    Menu.prototype.addText = function (x, y, text) {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'konami', text, 13.8);
    };
    return Menu;
}(Phaser.State));
//# sourceMappingURL=menu.js.map