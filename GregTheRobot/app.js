/// <reference path="enemies/boss.ts" />
/// <reference path="enemies/enemy.ts" />
/// <reference path="gamestates/menu.ts" />
/// <reference path="gamestates/level.ts" />
/// <reference path="gamestates/splash.ts" />
/// <reference path="gamestates/gameOver.ts" />
/// <reference path="phaser/pixi.d.ts" />
/// <reference path="phaser/p2.d.ts" />
/// <reference path="player/player.ts" />
/// <reference path="player/playerbullet.ts" />
/// <reference path="player/playerstate.ts" />
class GregTheRobot {
    constructor() {
        this.game = new Phaser.Game(512, 512, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload,
            update: this.update
        });
    }
    preload() {
        this.game.load.spritesheet('menu', 'assets/backgrounds/menu.png', 512, 384);
        this.game.load.spritesheet('splash01', 'assets/backgrounds/splash01.png', 512, 384);
        this.game.load.script('baseState', 'gamestates/baseState.js');
        this.game.load.script('menu', 'gamestates/menu.js');
        this.game.load.script('splash01', 'gamestates/splash.js');
        this.game.load.script('gameOver', 'gamestates/gameOver.js');
        this.game.load.script('level1', 'gamestates/level.js');
        this.game.load.script('player', 'player/player.js');
        this.game.load.script('playerBullet', 'player/playerBullet.js');
        this.game.load.script('playerState', 'player/playerState.js');
        this.game.load.script('boss', 'enemies/boss.js');
        this.game.load.script('enemy', 'enemies/enemy.js');
        this.game.load.script('battery', 'extras/battery.js');
        this.game.load.image('level', 'assets/backgrounds/level01.jpg');
        this.game.load.spritesheet('player', 'assets/sprites/player.png', 32, 32);
        this.game.load.spritesheet('battery', 'assets/sprites/battery.png', 32, 32);
        this.game.load.spritesheet('boss', 'assets/sprites/boss.png', 96, 96);
        this.game.load.spritesheet('enemy1', 'assets/sprites/enemy1.png', 32, 32);
        this.game.load.spritesheet('enemy2', 'assets/sprites/enemy2.png', 32, 32);
        this.game.load.spritesheet('enemy3', 'assets/sprites/enemy3.png', 32, 32);
        this.game.load.spritesheet('enemy4', 'assets/sprites/enemy4.png', 32, 32);
        this.game.load.spritesheet('enemy5', 'assets/sprites/enemy5.png', 32, 32);
        this.game.load.spritesheet('enemy6', 'assets/sprites/enemy6.png', 32, 32);
        this.game.load.spritesheet('enemy7', 'assets/sprites/enemy7.png', 32, 32);
        this.game.load.spritesheet('enemy8', 'assets/sprites/enemy8.png', 32, 32);
        this.game.load.spritesheet('enemy9', 'assets/sprites/enemy9.png', 32, 32);
        this.game.load.spritesheet('enemy10', 'assets/sprites/enemy10.png', 32, 32);
        this.game.load.spritesheet('enemy11', 'assets/sprites/enemy11.png', 32, 32);
        this.game.load.spritesheet('playerBullet', 'assets/sprites/PlayerBullet1SpriteSheet.png', 32, 32);
        this.game.load.audio('start', ['assets/audio/see-leprechau.wav']);
        this.game.load.audio('intro', ['assets/audio/fight-boss-1.wav']);
        this.game.load.audio('music', ['assets/audio/run-out-of-the-city.wav']);
        this.game.load.audio('playerDeath', ['assets/audio/fight-boss-3.wav']);
        this.game.load.audio('bulletSound', ['assets/audio/canon-1.wav']);
        this.game.load.audio('damage', ['assets/audio/canon-1.wav']);
        this.game.load.audio('died', ['assets/audio/died.wav']);
        this.game.load.audio('gameOver', ['assets/audio/died.wav']);
        this.game.load.bitmapFont('bitmapfont', 'assets/fonts/bitmapfont_0.png', 'assets/fonts/bitmapfont.xml');
    }
    create() {
        this.game.state.add('menu', Menu);
        this.game.state.add('splash01', Splash01);
        this.game.state.add('level1', Level1);
        this.game.state.add('gameover', GameOver);
        this.game.state.start('level1');
    }
    update() {
    }
    render() {
    }
}
window.onload = () => {
    var game = new GregTheRobot();
};
//# sourceMappingURL=app.js.map