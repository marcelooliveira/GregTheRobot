﻿/// <reference path="../enemies/boss.ts" />
/// <reference path="../enemies/enemy.ts" />
/// <reference path="../phaser/pixi.d.ts" />
/// <reference path="../phaser/p2.d.ts" />
/// <reference path="../player/player.ts" />
/// <reference path="../player/playerbullet.ts" />
/// <reference path="../player/playerstate.ts" />
/// <reference path="../phaser/phaser.d.ts" />

abstract class BaseLevel extends Phaser.State {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    bmd: Phaser.BitmapData;
    layer: Phaser.TilemapLayer;
    tileSprite: Phaser.TileSprite;
    player: Player;
    boss: Boss;
    enemies: BaseEnemy[];
    playerBullets: PlayerBullet[];
    extras: Battery[];
    cursors: Phaser.CursorKeys;
    levelMusic: Phaser.Sound;
    playerDeathSound: Phaser.Sound;
    bulletSound: Phaser.Sound;
    diedSound: Phaser.Sound;
    damageSound: Phaser.Sound;
    rechargeSound: Phaser.Sound;
    bossDeathSound: Phaser.Sound;
    statusBar: Phaser.BitmapText;
    powerBar: Phaser.Graphics;
    volume: number;
    levelNumber: number;

    preload() { 
    }

    create() {
        this.setupAudio();
        this.setupMap();
        this.setupKeyboard();
        this.setupStatusBar();
        this.setupPlayer();
        this.setupBoss();
        this.setupMapObjects()
        this.setupPlayerBullets();
    }
            
    update() {
        this.game.input.update();
        this.player.update();
        this.boss.update();
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.checkEnemyCollisions(this.enemies);
        });
        this.extras.forEach(extra => {
            extra.update();
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
        this.tileSprite = this.game.add.tileSprite(0, 0, 512, 3776, 'level' + this.levelNumber);
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
        this.layer = this.map.create('level' + this.levelNumber, WIDTH_IN_TILES, HEIGHT_IN_TILES, 32, 32);

        //  Populate some tiles for our player to start on

        var lines = this.readFile("/assets/maps/Map0" + this.levelNumber + ".txt").split('\n');
        for (var y = 0; y < lines.length; y++) {
            var line = lines[y];
            var lineArray = new Array(line.length);
            for (var x = 0; x < line.length; x++) {
                var char = line[x];
                if (char == 'X') {
                    this.map.putTile(1, x, y, this.layer);
                    lineArray[x] = 1;
                }
                else {
                    lineArray[x] = 0;
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
        this.levelMusic.play(null, null, .2, true);

        this.playerDeathSound = this.game.add.audio('playerDeath');
        this.playerDeathSound.onStop.add(this.playerDeathSoundStopped.bind(this));

        this.bulletSound = this.game.add.audio('bulletSound', 1, false);
        this.bulletSound.volume = this.volume;
        this.bulletSound.allowMultiple = true;

        this.diedSound = this.game.add.audio('died');
        this.diedSound.volume = this.volume;

        this.damageSound = this.game.add.audio('damage');
        this.damageSound.volume = this.volume;

        this.rechargeSound = this.game.add.audio('recharge');
        this.rechargeSound.volume = this.volume;

        this.bossDeathSound = this.game.add.audio('bossDeath');
        this.bossDeathSound.volume = this.volume;
        this.bossDeathSound.onStop.add(this.goNextLevel.bind(this));
    }

    setupPlayer(): void {
        this.player = new Player(this, this.cursors, this.layer, this.bulletSound, this.diedSound, this.damageSound, this.rechargeSound);
        this.player.setup();
        this.updatePowerBar();
    }

    setupBoss() {
        this.boss = new Boss(this, this.game, this.layer, this.bulletSound, this.player);
        this.boss.setup();
    }

    setupMapObjects() {
        var mapAsStringArray = this.readFile("/GregTheRobot/GregTheRobot/assets/maps/Map0" + this.levelNumber + ".txt").split('\n');
        this.setupExtras(mapAsStringArray);
        this.setupEnemies(mapAsStringArray);
    }

    setupExtras(mapAsStringArray: string[]) {
        this.extras = [];
        var extracodes = 'A';
        for (var y = 0; y < mapAsStringArray.length; y++) {
            var line = mapAsStringArray[y];
            for (var x = 0; x < line.length; x++) {
                var char = line[x];
                var indexOf = extracodes.indexOf(char);
                if (indexOf >= 0) {
                    var extra: Battery;

                    switch (char) {
                        case 'A':
                            extra = new Battery(this, this.game, this.layer, this.player, x * 32, y * 32, this.extras.length + 1);
                            break;
                        default:
                            break;
                    }
                    extra.setup();
                    this.extras.push(extra);
                }
            }
        }
    }

    setupEnemies(mapAsStringArray: string[]) {
        this.enemies = [];
        var enemycodes = 'abcde';
        for (var y = 0; y < mapAsStringArray.length; y++) {
            var line = mapAsStringArray[y];
            for (var x = 0; x < line.length; x++) {
                var char = line[x];
                var indexOf = enemycodes.indexOf(char);
                if (indexOf >= 0) {
                    var enemy: BaseEnemy;
                    var id: number = this.enemies.length + 1;
                    switch (indexOf) {
                        case 0:
                            enemy = new EnemyA(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1, id);
                            break;
                        case 1:
                            enemy = new EnemyB(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1, id);
                            break;
                        case 2:
                            enemy = new EnemyC(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1, id);
                            break;
                        case 3:
                            enemy = new EnemyD(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1, id);
                            break;
                        case 4:
                            enemy = new EnemyE(this, this.game, this.layer, this.bulletSound, this.player, x * 32, y * 32, indexOf + 1, id);
                            break;
                    }
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

    setupStatusBar() {
        this.powerBar = this.game.add.graphics(0, 0);
        this.statusBar = this.addText(0, this.game.camera.y / 16 + 30.25, 'POWER');
    }

    updatePowerBar() {
        var barPosition
            = new Phaser.Point(90, this.tileSprite.height - 32);

        this.powerBar.beginFill(0x000000);
        this.powerBar.lineStyle(2, 0x000000, 1);
        this.powerBar.drawRect(0, barPosition.y, 512, 32);
        this.powerBar.endFill();
        this.powerBar.lineStyle(2, 0xffffff, 2);
        this.powerBar.drawRect(barPosition.x, barPosition.y, 421, 24);

        var color: number;
        if (this.player.power > 75) {
            color = 0x00ff00;
        }
        else if (this.player.power > 30) {
            color = 0x0000ff;
        }
        else {
            color = 0xff0000;
        }
        this.powerBar.beginFill(color);
        this.powerBar.lineStyle(2, 0xffffff, 0);
        this.powerBar.drawRect(barPosition.x + 2, barPosition.y + 2, (this.player.power / 100) * 417, 20);
        this.powerBar.endFill();
    }

    addText(x: number, y: number, text: string): Phaser.BitmapText {
        return this.game.add.bitmapText(2 * (x * 8) + 2, 2 * (y * 8) + 2, 'bitmapfont', text, 13.8);
    }

    firePlayerBullet() {
        var playerBullet = new PlayerBullet(this, this.layer, this.bulletSound, this.player, this.boss);
        playerBullet.setup();
        this.playerBullets.push(playerBullet);
        if (this.player.decreasePower(1)) {
            this.updatePowerBar();
        }
    }

    playerStateChanged(newState: IPlayerState) {
        if (newState instanceof PlayerStateDying) {
            this.levelMusic.stop();
            this.bulletSound.stop();
            this.bulletSound.volume = 0;
            this.playerDeathSound.play();
        }
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

    bossKill() {
        this.bossDeathSound.play();
    }

    getScrollStep() {
        return 1;
    }

    playerWasHit(enemy) {
        this.player.wasHit();

        this.enemies.forEach((e, i) => {
            if (e === enemy) {
                this.enemies.splice(i, 1);
                return true;
            }
        });
    }

    playerRecharged(battery) {
        this.player.recharged(10);

        this.enemies.forEach((e, i) => {
            if (e === battery) {
                this.extras.splice(i, 1);
                return true;
            }
        });
    }

    playerDeathSoundStopped(sound: Phaser.Sound) {
        this.game.state.start('gameover');
    }

    scroll() {
        this.game.camera.y -= this.getScrollStep();

        if (this.game.camera.y > 0) {
            this.statusBar.position.y -= this.getScrollStep();
            this.powerBar.position.y -= this.getScrollStep();
            if (this.player.state instanceof PlayerStateRunning) {
                this.player.walk();
            }
        }
        this.game.time.events.add(Phaser.Timer.SECOND / 32, this.scroll.bind(this));
    }

    goNextLevel() {
        this.levelMusic.stop();
        this.bulletSound.stop();
        this.bulletSound.volume = 0;

        var nextStateName: string;
        if (this.levelNumber + 1 <= 3) {
            nextStateName = 'splash' + (this.levelNumber + 1);
        }
        else {
            nextStateName = 'theend';
        }
        this.game.state.start(nextStateName);
    }
}

class Level1 extends BaseLevel {
    constructor() {
        super();
        this.levelNumber = 1;
    }
}

class Level2 extends BaseLevel {
    constructor() {
        super();
        this.levelNumber = 2;
    }
}

class Level3 extends BaseLevel {
    constructor() {
        super();
        this.levelNumber = 3;
    }
}