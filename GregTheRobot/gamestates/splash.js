class BaseSplash extends BaseState {
    constructor() {
        super();
        Splash1.firstTime = true;
    }
    create() {
        this.addText(12, 11, ' LEVEL ' + this.levelNumber);
        //this.addText(12, 13, 'THE TYRANT');
        if (Splash1.firstTime) {
            Splash1.firstTime = false;
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
        this.game.state.start('level' + this.levelNumber);
    }
}
class Splash1 extends BaseSplash {
    constructor() {
        super();
        this.levelNumber = 1;
    }
}
class Splash2 extends BaseSplash {
    constructor() {
        super();
        this.levelNumber = 2;
    }
}
class Splash3 extends BaseSplash {
    constructor() {
        super();
        this.levelNumber = 3;
    }
}
//# sourceMappingURL=splash.js.map