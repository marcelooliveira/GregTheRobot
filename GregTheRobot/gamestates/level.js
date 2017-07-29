/// <reference path="../enemies/boss.ts" />
/// <reference path="../enemies/enemy.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />
/// <reference path="../player/player.ts" />
/// <reference path="../player/playerbullet.ts" />
/// <reference path="../player/playerstate.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Level1 = (function (_super) {
    __extends(Level1, _super);
    function Level1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Level1.prototype.preload = function () {
    };
    Level1.prototype.create = function () {
        this.setupAudio();
        this.setupMap();
        this.setupKeyboard();
        this.setupPlayer();
        this.setupBoss();
        this.setupEnemies();
        this.setupPlayerBullets();
    };
    Level1.prototype.update = function () {
        this.game.input.update();
        this.player.update();
        this.boss.update();
        this.enemies.forEach(function (enemy) {
            enemy.update();
        });
        this.playerBullets.forEach(function (bullet) {
            bullet.update();
        });
    };
    Level1.prototype.render = function () {
    };
    Level1.prototype.readFile = function (file) {
        var request = new XMLHttpRequest();
        request.open("GET", file, false);
        request.send(null);
        var returnValue = request.responseText;
        return returnValue;
    };
    Level1.prototype.setupMap = function () {
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
    };
    Level1.prototype.setupAudio = function () {
        this.volume = .2;
        this.levelMusic = this.game.add.audio('music');
        this.levelMusic.volume = this.volume;
        this.levelMusic.play();
        this.playerDeathSound = this.game.add.audio('playerDeath');
        this.playerDeathSound.onStop.add(this.soundStopped.bind(this));
        this.bulletSound = this.game.add.audio('bulletSound');
        this.bulletSound.volume = this.volume;
        this.bulletSound.allowMultiple = true;
    };
    Level1.prototype.setupPlayer = function () {
        this.player = new Player(this, this.cursors, this.layer, this.bulletSound);
        this.player.setup();
    };
    Level1.prototype.setupBoss = function () {
        this.boss = new Boss(this.game, this.layer, this.bulletSound, this.player);
        this.boss.setup();
    };
    Level1.prototype.setupEnemies = function () {
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
    };
    Level1.prototype.setupPlayerBullets = function () {
        this.playerBullets = [];
    };
    Level1.prototype.setupKeyboard = function () {
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    Level1.prototype.firePlayerBullet = function () {
        var playerBullet = new PlayerBullet(this, this.layer, this.bulletSound, this.player, this.boss);
        playerBullet.setup();
        this.playerBullets.push(playerBullet);
    };
    Level1.prototype.playerBulletHit = function (playerBullet, target) {
        var _this = this;
        this.playerBullets.forEach(function (b, i) {
            if (b == playerBullet) {
                _this.playerBullets.splice(i, 1);
                return true;
            }
        });
        this.enemies.forEach(function (e, i) {
            if (e == target) {
                _this.enemies.splice(i, 1);
                return true;
            }
        });
        if (target.wasHit) {
            target.wasHit();
        }
    };
    Level1.prototype.getScrollStep = function () {
        return 1;
    };
    Level1.prototype.playerWasHit = function (enemy) {
        var _this = this;
        if (this.player.sprite.animations.currentAnim.name == 'run') {
            this.levelMusic.stop();
            this.playerDeathSound.play();
            this.player.wasHit();
        }
        this.enemies.forEach(function (e, i) {
            if (e === enemy) {
                _this.enemies.splice(i, 1);
                return true;
            }
        });
    };
    Level1.prototype.soundStopped = function (sound) {
        if (sound.name == 'playerDeath') {
            this.game.state.start('splash01');
        }
    };
    Level1.prototype.scroll = function () {
        this.game.camera.y -= this.getScrollStep();
        if (this.player.state instanceof PlayerStateRunning) {
            this.player.walk();
        }
        this.game.time.events.add(Phaser.Timer.SECOND / 32, this.scroll.bind(this));
    };
    return Level1;
}(Phaser.State));
//# sourceMappingURL=level.js.map