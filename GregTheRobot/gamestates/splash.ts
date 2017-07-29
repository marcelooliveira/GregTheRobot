class Splash01 extends Phaser.State {
    introSound: Phaser.Sound;
    static firstTime: boolean;
    constructor() {
        super();
        Splash01.firstTime = true;
    }

    create() {
        this.game.add.sprite(0, 0, 'splash01');
        if (Splash01.firstTime) {
            Splash01.firstTime = false;
            this.introSound = this.game.add.audio('intro');
            this.introSound.volume = .2;
            this.introSound.onStop.add(this.resumeGame.bind(this));
            this.introSound.play();
        }
        else {
            this.game.time.events.add(Phaser.Timer.SECOND, this.resumeGame, this);
        }
    }

    resumeGame() {
        this.game.state.start('level1');
    }
}