class PlayerBullet {
    constructor(level, layer, bulletSound, player, boss) {
        this.level = level;
        this.game = level.game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.boss = boss;
        this.destroyed = false;
        this.create();
    }
    create() {
    }
    update() {
        this.game.physics.arcade.collide(this.sprite, this.layer, function () {
            this.sprite.position.x = 0;
            this.sprite.position.y = 0;
        }.bind(this));
        if (this.sprite.position.x == 0 && this.sprite.position.y == 0) {
            this.destroyed = false;
            this.sprite.destroy();
        }
        this.game.physics.arcade.collide(this.sprite, this.boss.sprite, function () {
            this.sprite.destroy();
            this.level.playerBulletHit(this, this.boss);
            this.boss.wasHit();
            this.destroyed = false;
        }.bind(this));
        this.level.enemies.forEach(enemy => {
            this.game.physics.arcade.collide(this.sprite, enemy.sprite, function () {
                this.destroyed = false;
                this.level.playerBulletHit(this, enemy);
                this.sprite.destroy();
                enemy.sprite.destroy();
            }.bind(this));
        });
        if (this.sprite.animations.currentFrame) {
            var currentFrameindex = this.sprite.animations.currentFrame.index;
            this.sprite.rotation = currentFrameindex * Math.PI / 4;
        }
    }
    setup() {
        this.sprite = this.game.add.sprite(this.player.sprite.position.x, this.player.sprite.position.y - 32, 'playerBullet');
        this.sprite.animations.add('bullet', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
        this.sprite.animations.play('bullet');
        this.velocity = 250;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.velocity.y = -this.velocity;
    }
}
//# sourceMappingURL=playerbullet.js.map