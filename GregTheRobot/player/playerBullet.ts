class PlayerBullet {
    level: Level1;
    game: Phaser.Game;
    layer: Phaser.TilemapLayer;
    bulletSound: Phaser.Sound;
    sprite: Phaser.Sprite;
    player: Player;
    boss: Boss;
    isWeaponLoaded: boolean;
    velocity: number;

    constructor(
        level: Level1, layer: Phaser.TilemapLayer, bulletSound: Phaser.Sound,
        player: Player, boss: Boss) {
        this.level = level;
        this.game = level.game;
        this.layer = layer;
        this.bulletSound = bulletSound;
        this.player = player;
        this.boss = boss;
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
            this.sprite.destroy();
        }

        this.game.physics.arcade.collide(this.sprite, this.boss.sprite, function () {
            this.level.playerBulletHit(this, this.boss);
            this.sprite.destroy();
        }.bind(this));

        this.level.enemies.forEach(enemy => {
            this.game.physics.arcade.collide(this.sprite, enemy.sprite, function () {
                this.level.playerBulletHit(this, enemy);
                this.sprite.destroy();  
                enemy.sprite.destroy();  
            }.bind(this));
        });
    }

    setup() {
        this.sprite = this.game.add.sprite(this.player.sprite.position.x
            , this.player.sprite.position.y - 32, 'playerBullet');
        this.velocity = 500;
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 0, 0);
        this.sprite.body.velocity.y = - this.velocity;
    }
}