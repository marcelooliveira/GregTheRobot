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
var Splash01 = (function (_super) {
    __extends(Splash01, _super);
    function Splash01() {
        var _this = _super.call(this) || this;
        Splash01.firstTime = true;
        return _this;
    }
    Splash01.prototype.create = function () {
        this.game.add.sprite(0, 0, 'splash01');
        if (Splash01.firstTime) {
            Splash01.firstTime = false;
            this.introSound = this.game.add.audio('intro');
            this.introSound.volume = .2;
            this.introSound.onStop.add(this.resumeGame.bind(this));
            this.introSound.play();
        }
        else {
            this.game.time.events.add(Phaser.Timer.SECOND, this.resumeGame, this);
        }
    };
    Splash01.prototype.resumeGame = function () {
        this.game.state.start('level1');
    };
    return Splash01;
}(Phaser.State));
//# sourceMappingURL=splash.js.map