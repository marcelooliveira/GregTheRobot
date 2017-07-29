/// <reference path="../app.ts" />
/// <reference path="playerState.ts" />

interface IPlayer {
    velocity: number;
    sprite: Phaser.Sprite;
    isWeaponLoaded: boolean;

    wasHit();
    resurrect();
    walk();
    runUp();
    runDown();
    runLeft();
    runRight();
    shoot();
}

class Player implements IPlayer {
    level: Level1;
    game: Phaser.Game;
    cursors: Phaser.CursorKeys;
    layer: Phaser.TilemapLayer;
    bulletSound: Phaser.Sound;
    sprite: Phaser.Sprite;
    isWeaponLoaded: boolean;
    velocity: number;
    walkingVelocity: number;
    state: IPlayerState;

    constructor(
        level: Level1, cursors: Phaser.CursorKeys,
        layer: Phaser.TilemapLayer, bulletSound: Phaser.Sound) {
        this.level = level;
        this.game = level.game;
        this.cursors = cursors;
        this.layer = layer;
        this.bulletSound = bulletSound;
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
        if (currentFrameindex % 2 == 0) {
            //this.sprite.position.y += .2; 
        }
        else {
            //this.sprite.position.y -= .2; 
        }

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

        this.sprite.animations.add('run', [0, 1, 2, 3], 4, true);
        this.sprite.animations.add('die', [4, 5, 6, 7, 4, 5, 6, 7], 10, true);
        this.sprite.animations.play('run');
        this.velocity = 150;
        this.walkingVelocity = 60;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.anchor.setTo(0.5, 0.5);
    }

    setStrategy(strategy: IPlayerState) {
        this.state = new PlayerStateRunning(this);
    }
    
    wasHit() {
        this.sprite.animations.play('die');
        this.state = new PlayerStateDying(this);
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
            this.sprite.body.velocity.y = - this.walkingVelocity;
        }
    }

    runUp() {
        this.sprite.body.velocity.y = -this.velocity;
    }

    runDown() {
        this.sprite.body.velocity.y = this.velocity;
    }

    runLeft() {
        this.sprite.body.velocity.x = -this.velocity;
    }

    runRight() {
        this.sprite.body.velocity.x = this.velocity;
    }

    shoot() {
        this.bulletSound.play();
        this.level.firePlayerBullet();
    }
}