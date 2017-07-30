/// <reference path="../app.ts" />
/// <reference path="playerState.ts" />
class Player {
    constructor(level, cursors, layer, bulletSound, diedSound, damageSound) {
        this.level = level;
        this.game = level.game;
        this.cursors = cursors;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.diedSound = diedSound;
        this.damageSound = damageSound;
        this.damageSound.onStop.add(function () {
            this.sprite.animations.play('run');
        }.bind(this));
        this.power = 10;
        this.create();
    }
    create() {
        this.isWeaponLoaded = true;
        this.state = new PlayerStateRunning(this);
    }
    update() {
        this.game.physics.arcade.collide(this.sprite, this.layer);
        this.sprite.body.velocity.set(0);
        var currentFrameindex = this.sprite.animations.currentFrame.index;
        switch (currentFrameindex) {
            case 0:
                this.sprite.rotation = -.1;
                break;
            case 1:
                this.sprite.rotation = 0;
                break;
            case 2:
                this.sprite.rotation = .1;
                break;
            case 3:
                this.sprite.rotation = 0;
                break;
            default:
                this.sprite.rotation = 0;
                break;
        }
        this.state.update(this.cursors, this.game.input.keyboard, this.game.camera);
    }
    setup() {
        this.sprite = this.game.add.sprite(this.game.world.centerX - 16, this.game.world.height - 64, 'player');
        //this.sprite = this.game.add.sprite(this.game.world.centerX - 16, 256, 'player');
        this.sprite.animations.add('run', [0, 1, 2, 3], 4, true);
        this.sprite.animations.add('hit', [4, 5, 6, 7, 4, 5, 6, 7], 10, true);
        this.sprite.animations.add('die', [4, 5, 6, 7, 4, 5, 6, 7], 10, true);
        this.sprite.animations.play('run');
        this.velocity = 150;
        this.walkingVelocity = 60;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.anchor.setTo(0.5, 0.5);
    }
    setStrategy(strategy) {
        this.state = new PlayerStateRunning(this);
    }
    wasHit() {
        this.damageSound.play();
        this.sprite.animations.play('hit');
        this.decreasePower(1);
    }
    resurrect() {
        this.sprite.animations.play('walk');
        this.state = new PlayerStateRunning(this);
    }
    walk() {
        if (!this.cursors.down.isDown
            && !this.cursors.up.isDown
            && !this.cursors.left.isDown
            && !this.cursors.right.isDown) {
            this.sprite.body.velocity.y = -this.walkingVelocity;
        }
    }
    runUp() {
        this.sprite.body.velocity.y = -this.velocity;
        //this.decreasePower(1);
    }
    runDown() {
        this.sprite.body.velocity.y = this.velocity;
        //this.decreasePower(1);
    }
    runLeft() {
        this.sprite.body.velocity.x = -this.velocity;
        //this.decreasePower(1);
    }
    runRight() {
        this.sprite.body.velocity.x = this.velocity;
        //this.decreasePower(1);
    }
    shoot() {
        this.bulletSound.play();
        this.level.firePlayerBullet();
    }
    decreasePower(energyAmount) {
        if (this.power - energyAmount > 0) {
            this.power -= energyAmount;
            this.level.updatePowerBar();
            return true;
        }
        else {
            this.power = 0;
            this.level.updatePowerBar();
            this.state = new PlayerStateDying(this);
            this.diedSound.play();
            this.level.playerStateChanged(this.state);
            return false;
        }
    }
}
//# sourceMappingURL=player.js.map