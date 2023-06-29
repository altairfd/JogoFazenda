import { CONFIG } from "../config";

//Player
export default class Player extends Phaser.Physics.Arcade.Sprite {
  /** @type {Phaser.Type.Input.Keybord.CursorKey} */
  cursors;
  touch;
  isAction = false;

  constructor(scene, x, y, touch) {
    super(scene, x, y, 'Player');
    this.touch = touch;

    scene.add.existing(this); //Criando imagem do Player
    scene.physics.add.existing(this); //Criando a fisica
    this.init();


  }

  init() {
    this.setFrame(3);
    this.speed = 120;
    this.frameRate = 12;
    this.direction = 'down';
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.setOrigin(0, .5);
    this.body.setSize(10, 10);
    this.body.setOffset(20, 16);
    this.initAnimations();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    //Moves
    this.play('idle-down');
    
  }

  update() {
    const { left, right, down, up, space } = this.cursors;

    if (left.isDown) {
      this.direction = 'left';
      this.setVelocityX(-this.speed);
    } else if (right.isDown) {
      this.direction = 'right';
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    if (up.isDown) {
      this.direction = 'up';
      this.setVelocityY(-this.speed);
    } else if (down.isDown) {
      this.direction = 'down';
      this.setVelocityY(this.speed);
    } else {
      this.setVelocityY(0);
    }

    if (space.isDown) {
      this.isAction = true;
    } else {
      this.isAction = false;
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.play('idle-' + this.direction, true);
    } else {
      this.play('walk-' + this.direction, true);
    }

    let tx, ty;
    let distance = 16;

    switch (this.direction) {
      case 'down':
        tx = 0;
        ty = distance;
        break;
      case 'up':
        tx = 0;
        ty = -distance + CONFIG.TILE_SIZE;
        break;
      case 'right':
        tx = distance / 2;
        ty = CONFIG.TILE_SIZE / 2;
        break;
      case 'left':
        tx = -distance / 2
        ty = CONFIG.TILE_SIZE / 2;
        break;
    }
    this.touch.setPosition(this.x + tx + CONFIG.TILE_SIZE / 2, this.y + ty)
  }

  initAnimations() {
    // Idle
    this.anims.create({
      key: 'idle-right',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 25, end: 31
      }),
      frameRate: this.frameRate,
      repeat: -1
    })

    this.anims.create({
      key: 'idle-up',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 9, end: 15
      }),
      frameRate: this.frameRate,
      repeat: -1
    })

    this.anims.create({
      key: 'idle-left',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 17, end: 23
      }),
      frameRate: this.frameRate,
      repeat: -1
    })


    this.anims.create({
      key: 'idle-down',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 1, end: 8
      }),
      frameRate: this.frameRate,
      repeat: -1
    })

    // Walk
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 49, end: 56
      }),
      frameRate: this.frameRate,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 72, end: 79
      }),
      frameRate: this.frameRate,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 57, end: 63
      }),
      frameRate: this.frameRate,
      repeat: -1
    })


    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('Player', {
        start: 64, end: 71
      }),
      frameRate: this.frameRate,
      repeat: -1
    })
  }
}