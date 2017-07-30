/// <reference path="../app.ts" />
class Enemy {
    constructor(level, game, layer, bulletSound, player, x, y, enemyNumber) {
        this.level = level;
        this.game = game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.create();
        this.x = x;
        this.y = y;
        this.enemyNumber = enemyNumber;
        this.velocity = 16;
    }
    create() {
        this.isWeaponLoaded = true;
    }
    update() {
        if (this.sprite.inCamera) {
            this.sprite.body.velocity.y = this.velocity;
        }
        this.game.physics.arcade.collide(this.sprite, this.player.sprite, function () {
            this.level.playerWasHit(this);
            this.sprite.destroy();
        }.bind(this));
    }
    setup() {
        this.sprite = this.game.add.sprite(this.x, this.y, 'enemy' + this.enemyNumber);
        this.sprite.animations.add('run', [0, 1, 2, 3, 2, 1], 4, true);
        this.sprite.animations.play('run');
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
    }
    wasHit() {
    }
}
//# sourceMappingURL=enemy.js.map