/// <reference path="../app.ts" />
class Battery {
    constructor(level, game, layer, player, x, y, extraNumber) {
        this.level = level;
        this.game = game;
        this.layer = layer;
        this.player = player;
        this.create();
        this.x = x;
        this.y = y;
        this.extraNumber = extraNumber;
    }
    create() {
    }
    update() {
        this.game.physics.arcade.collide(this.sprite, this.player.sprite, function () {
            this.level.playerRecharged(this);
            this.sprite.destroy();
        }.bind(this));
    }
    setup() {
        this.sprite = this.game.add.sprite(this.x, this.y, 'battery');
        this.sprite.animations.add('hide', [0], 1, true);
        this.sprite.animations.add('show', [1, 2, 3, 3, 2, 1], 4, true);
        this.sprite.animations.play('show');
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(32, 32, 0, 0);
    }
    wasHit() {
    }
}
//# sourceMappingURL=battery.js.map