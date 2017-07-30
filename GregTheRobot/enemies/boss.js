class Boss {
    constructor(level, game, layer, bulletSound, player) {
        this.level = level;
        this.game = game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.power = 100;
        this.create();
    }
    create() {
        this.isWeaponLoaded = true;
    }
    update() {
        //this.game.debug.text('boss x, y: '
        //    + parseInt(this.sprite.position.x.toString())
        //    + ', ' + parseInt(this.sprite.position.y.toString())
        //    , 32, 32);
        this.game.physics.arcade.collide(this.sprite, this.layer, function () {
            this.velocity *= -1;
            this.sprite.body.velocity.x = this.velocity;
        }.bind(this));
        this.game.physics.arcade.collide(this.sprite, this.player.sprite, function () {
            if (this.player.sprite.animations.currentAnim.name == 'run') {
                this.player.wasHit(this);
            }
        }.bind(this));
        if (this.sprite.animations.currentAnim.name == 'hit'
            && this.sprite.animations.currentFrame.index == 0) {
            this.sprite.animations.play('run');
        }
    }
    setup() {
        this.sprite = this.game.add.sprite(this.game.world.centerX - 48, 64, 'boss' + this.level.levelNumber);
        //this.sprite = this.game.add.sprite(this.game.world.centerX - 16, this.game.world.height - 256, 'boss' + this.level.levelNumber);
        this.sprite.animations.add('run', [0, 1, 2, 3], 4, true);
        this.sprite.animations.add('hit', [4, 5, 6, 7, 4, 5, 6, 7, 0], 10, true);
        this.sprite.animations.play('run');
        this.velocity = 150;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(96, 96, 0, 0);
        this.sprite.body.velocity.x = this.velocity;
    }
    wasHit() {
        this.sprite.animations.play('hit', 10, false);
        this.decreasePower(10);
    }
    decreasePower(energyAmount) {
        if (this.power - energyAmount > 0) {
            this.power -= energyAmount;
            return true;
        }
        else {
            this.power = 0;
            this.level.bossKill();
            return false;
        }
    }
}
//# sourceMappingURL=boss.js.map