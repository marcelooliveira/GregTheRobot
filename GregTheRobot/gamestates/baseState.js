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
var BaseState = (function (_super) {
    __extends(BaseState, _super);
    function BaseState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseState.prototype.addText = function (x, y, text) {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'konami', text, 13.8);
    };
    return BaseState;
}(Phaser.State));
//# sourceMappingURL=baseState.js.map