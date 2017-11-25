/// <reference path="../app.ts" />
abstract class BaseEnemy {
    level: Level1;
    game: Phaser.Game;
    layer: Phaser.TilemapLayer;
    bulletSound: Phaser.Sound;
    sprite: Phaser.Sprite;
    player: Player;
    isWeaponLoaded: boolean;
    velocity: number;
    x: number;
    y: number;
    enemyNumber: number;
    id: number;

    constructor(
        level: Level1, game: Phaser.Game, layer: Phaser.TilemapLayer, bulletSound: Phaser.Sound,
        player: Player, x: number, y: number, enemyNumber: number, id: number) {
        this.level = level;
        this.game = game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.create();
        this.x = x;
        this.y = y;
        this.enemyNumber = enemyNumber;
        this.id = id;
        this.velocity = 16;
    }

    create() {
        this.isWeaponLoaded = true;
    }

    update() {

    }

    checkPlayerCollisions() {
        this.game.physics.arcade.collide(this.sprite, this.player.sprite, function () {
            this.level.playerWasHit(this);
            this.sprite.destroy();
        }.bind(this));
    }

    checkEnemyCollisions(enemies: BaseEnemy[]) {
        enemies.forEach(other => {
            if (this.id != other.id) {
                this.game.physics.arcade.collide(this.sprite, other.sprite, function () {

                }.bind(this));  
            }
        });
    }

    setup() {
        this.sprite = this.game.add.sprite(this.x, this.y, 'enemy' + this.enemyNumber);
        this.sprite.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 4, true);
        this.sprite.animations.play('run');
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
    }

    wasHit() {
    }
}

class EnemyA extends BaseEnemy {
    update() {
        super.update();

        if (this.sprite.inCamera) {
            this.sprite.body.velocity.y = this.velocity;
            this.sprite.body.velocity.x = this.velocity
                * ((this.game.time.totalElapsedSeconds() % 2) - 1);
        }
        super.checkPlayerCollisions();
    }
}

class EnemyB extends BaseEnemy {
    update() {
        super.update();

        if (this.sprite.inCamera) {
            var direction: number;

            if (this.sprite.body.position.x > this.player.sprite.body.position.x)
            {
                direction = -1;
            }
            else {
                direction = 1;
            }
            this.sprite.body.velocity.x = direction * this.velocity
                * (this.game.time.totalElapsedSeconds() % 4);
        }
        super.checkPlayerCollisions();
    }
}

class EnemyC extends BaseEnemy {
    update() {
        super.update();

        if (this.sprite.inCamera) {
            this.sprite.body.velocity.x = this.velocity
                * ((this.game.time.totalElapsedSeconds() % 4) - 2);
        }
        super.checkPlayerCollisions();
    }
}

class EnemyD extends BaseEnemy {
    update() {
        super.update();

        if (this.sprite.inCamera) {
            this.sprite.body.velocity.y = this.velocity;
            this.sprite.body.velocity.x = this.velocity
                * ((this.game.time.totalElapsedSeconds() % 4) - 2);
        }
        super.checkPlayerCollisions();
    }
}

class EnemyE extends BaseEnemy {
    update() {
        super.update();

        if (this.sprite.inCamera) {
            this.sprite.body.velocity.y = this.velocity * 2;
        }
        super.checkPlayerCollisions();
    }
}
