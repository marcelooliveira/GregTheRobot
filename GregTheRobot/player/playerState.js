class PlayerStateRunning {
    constructor(player) {
        this.player = player;
    }
    update(cursors, keyboard, camera) {
        if (cursors.up.isDown) {
            this.player.runUp();
        }
        else if (cursors.down.isDown) {
            if (this.player.sprite.body.y <
                camera.y + camera.height
                    - this.player.sprite.height) {
                this.player.runDown();
            }
        }
        if (cursors.left.isDown) {
            this.player.runLeft();
        }
        else if (cursors.right.isDown) {
            this.player.runRight();
        }
        if (this.player.isWeaponLoaded && keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.player.isWeaponLoaded = false;
            this.player.shoot();
        }
        else if (!keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            this.player.isWeaponLoaded = true;
        }
    }
}
class PlayerStateDying {
    constructor(player) {
        this.player = player;
    }
    update(cursors, keyboard, camera) {
    }
}
//# sourceMappingURL=playerState.js.map