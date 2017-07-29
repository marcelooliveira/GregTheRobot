/// <reference path="../enemies/boss.ts" />
/// <reference path="../enemies/enemy.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />
/// <reference path="../player/player.ts" />
/// <reference path="../player/playerbullet.ts" />
/// <reference path="../player/playerstate.ts" />

class Level1 extends Phaser.State {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    bmd: Phaser.BitmapData;
    layer: Phaser.TilemapLayer;
    tileSprite: Phaser.TileSprite;
    player: Player;
    boss: Boss;
    enemies: Enemy[];
    playerBullets: PlayerBullet[];
    cursors: Phaser.CursorKeys;
    levelMusic: Phaser.Sound;
    playerDeathSound: Phaser.Sound;
    bulletSound: Phaser.Sound;
    volume: number;

    preload() { 
    }

    create() {
        this.setupAudio();
        this.setupMap();
        this.setupKeyboard();
        this.setupPlayer();
        this.setupBoss();
        this.setupEnemies();
        this.setupPlayerBullets();
    }
            
    update() {
        this.game.input.update();
        this.player.update();
        this.boss.update();
        this.enemies.forEach(enemy => {
            enemy.update();
        });
        this.playerBullets.forEach(bullet => {
            bullet.update();
        });
    }

    render() {
    }

    readFile(file: string) : string {
        var request = new XMLHttpRequest();
        request.open("GET", file, false);
        request.send(null);
        var returnValue = request.responseText;

        return returnValue;
    }

    setupMap() {
        this.tileSprite = this.game.add.tileSprite(0, 0, 512, 3776, 'level');
        this.game.world.setBounds(0, 0, 512, 3776);

        //  Creates a blank tilemap
        this.map = this.game.add.tilemap();

        //  This is our tileset - it's just a BitmapData filled with a selection of randomly colored tiles
        //  but you could generate anything here
        this.bmd = this.game.make.bitmapData(32 * 25, 32 * 2);

        var colors = Phaser.Color.HSVColorWheel();

        var i = 0;

        for (var y = 0; y < 2; y++) {
            for (var x = 0; x < 25; x++) {
                //this.bmd.rect(x * 32, y * 32, 32, 32, colors[i].rgba);
                i += 6;
            }
        }

        //  Add a Tileset image to the map
        this.map.addTilesetImage('tiles', this.bmd);

        //  Creates a new blank layer and sets the map dimensions.
        //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        var WIDTH_IN_TILES = 16;
        var HEIGHT_IN_TILES = 118;
        this.layer = this.map.create('level1', WIDTH_IN_TILES, HEIGHT_IN_TILES, 32, 32);

        //  Populate some tiles for our player to start on

        var lines = this.readFile("/assets/maps/Map01.txt").split('\n');
        for (var y = 0; y < lines.length; y++) {
            var line = lines[y];
            for (var x = 0; x < line.length; x++) {
                var char = line[x];
                if (char == 'X') {
                    this.map.putTile(1, x, y, this.layer);
                }
            }
        }

        this.map.setCollisionByExclusion([0]);

        this.game.camera.y = this.map.height * this.map.tileHeight;

        this.game.time.events.add(Phaser.Timer.SECOND, this.scroll.bind(this));
    }

    setupAudio() {
        this.volume = .2;
        this.levelMusic = this.game.add.audio('music');
        this.levelMusic.volume = this.volume;
        this.levelMusic.play();

        this.playerDeathSound = this.game.add.audio('playerDeath');
        this.playerDeathSound.onStop.add(this.soundStopped.bind(this));

        this.bulletSound = this.game.add.audio('bulletSound');
        this.bulletSound.volume = this.volume;
        this.bulletSound.allowMultiple = true;
    }

    setupPlayer() : void {
        this.player = new Player(this, this.cursors, this.layer, this.bulletSound);
        this.player.setup();
    }

    setupBoss() {
        this.boss = new Boss(this.game, this.layer, this.bulletSound, this.player);
        this.boss.setup();
    }

    setupEnemies() {
        this.enemies = [];
        var enemycodes = 'abcdefghijklmnop';
        var lines = this.readFile("/assets/maps/Map01.txt").split('\n');
        for (var y = 0; y < lines.length; y++) {
            var line = lines[y];
            for (var x = 0; x < line.length; x++) {
                var char = line[x];
                var indexOf = enemycodes.indexOf(char);
                if (indexOf >= 0) {
                    var enemy = new Enemy(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1);
                    enemy.setup();
                    this.enemies.push(enemy);
                }
            }
        }

    }

    setupPlayerBullets() {
        this.playerBullets = [];
    }

    setupKeyboard() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    firePlayerBullet() {
        var playerBullet = new PlayerBullet(this, this.layer, this.bulletSound, this.player, this.boss);
        playerBullet.setup();
        this.playerBullets.push(playerBullet);
    }

    playerBulletHit(playerBullet, target) {
        this.playerBullets.forEach((b, i) => {
            if (b == playerBullet) {
                this.playerBullets.splice(i, 1);
                return true;
            }
        });

        this.enemies.forEach((e, i) => {
            if (e == target) {
                this.enemies.splice(i, 1);
                return true;
            }
        });

        if (target.wasHit) {
            target.wasHit();
        }
    }

    getScrollStep() {
        return 1;
    }

    playerWasHit(enemy) {
        if (this.player.sprite.animations.currentAnim.name == 'run') {
            this.levelMusic.stop();
            this.playerDeathSound.play();
            this.player.wasHit();
        }

        this.enemies.forEach((e, i) => {
            if (e === enemy) {
                this.enemies.splice(i, 1);
                return true;
            }
        });
    }

    soundStopped(sound: Phaser.Sound) {
        if (sound.name == 'playerDeath') {
            this.game.state.start('splash01');
        }
    }

    scroll() {
        this.game.camera.y -= this.getScrollStep();
        if (this.player.state instanceof PlayerStateRunning) {
            this.player.walk();
        }
        this.game.time.events.add(Phaser.Timer.SECOND / 32, this.scroll.bind(this));
    }
}
