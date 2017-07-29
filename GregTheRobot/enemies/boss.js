var Boss = (function () {
    function Boss(game, layer, bulletSound, player) {
        this.game = game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.create();
    }
    Boss.prototype.create = function () {
        this.isWeaponLoaded = true;
    };
    Boss.prototype.update = function () {
        this.game.physics.arcade.collide(this.sprite, this.layer, function () {
            this.velocity *= -1;
            this.sprite.body.velocity.x = this.velocity;
        }.bind(this));
        this.game.physics.arcade.collide(this.sprite, this.player.sprite, function () {
            //alert('game over');
            this.player.wasHit(this);
        }.bind(this));
        //if (this.isWeaponLoaded && this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        //    this.isWeaponLoaded = false;
        //    this.bulletSound.play();
        //}
        //else if (!this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
        //    this.isWeaponLoaded = true;
        //}
        if (this.sprite.animations.currentAnim.name == 'hit'
            && this.sprite.animations.currentFrame.index == 0) {
            this.sprite.animations.play('run');
        }
    };
    Boss.prototype.setup = function () {
        this.sprite = this.game.add.sprite(this.game.world.centerX - 48, 64, 'boss');
        this.sprite.animations.add('run', [0, 1], 2, true);
        this.sprite.animations.add('hit', [2, 3, 2, 3, 0], 10, true);
        this.sprite.animations.play('run');
        this.velocity = 150;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(96, 96, 0, 0);
        this.sprite.body.velocity.x = this.velocity;
    };
    Boss.prototype.wasHit = function () {
        this.sprite.animations.play('hit', 10, false);
    };
    return Boss;
}());
//# sourceMappingURL=boss.js.map