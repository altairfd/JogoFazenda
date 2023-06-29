//Vaca
export default class Cow extends Phaser.Physics.Arcade.Sprite {
  clock;
  touching = false;

  constructor(scene, x, y) {
    super(scene, x, y, 'Cow');
    scene.add.existing(this) //Criando imagem da vaca
    scene.physics.add.existing(this); //Criando a fisica
    this.init();
  }

  init() {
    this.setFrame(0);
    this.frameRate = 6;
    this.direction = 'idle';
    this.setOrigin(0, .5);
    this.body.setSize(10, 10);
    this.initAnimation();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.play('idle');

    this.clock = this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.autoDirect();
      },
      callbackScope: this, 
      loop: true
    })

    if (this.touching == true) {
      this.play('happy')
    }
  }

  initAnimation() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('Cow', {
        start: 0, end: 2
      }),
      frameRate: this.frameRate,
      repeat: -1,
    })

    this.anims.create({
      key: 'eat',
      frames: this.anims.generateFrameNames('Cow', {
        start: 40 ,end: 46
      }),
      frameRate: 2,
      repeat: -1, 
      
    })

    this.anims.create({
      key: 'eat2',
      frames: this.anims.generateFrameNames('Cow', {
        start: 48, end: 51
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'right-walk',
      frames: this.anims.generateFrameNames('Cow', {
        start: 8, end: 14
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'left-walk',
      frames: this.anims.generateFrameNames('Cow', {
        start: 8, end: 14
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'happy',
      frame: this.anims.generateFrameNames('Cow', {
        start: 55, end: 60
      }),
      frameRate: 8,
      repeatt: -1
    })
  }
  
  autoDirect() {
    var autoRun = Math.floor(Math.random() * 5);
    console.log(autoRun)
    switch (autoRun) {
      case 1:
        this.flipX = false;
        this.setVelocityX(0);
        this.play('idle');
        break;
      case 2:
        this.flipX = false;
        this.setVelocityX(0);
        this.play('eat2');
        break;

      case 3:
        this.flipX = false;
        this.setVelocityX(0);
        this.play('right-walk')
        this.setVelocityX(8);
        break;
        
      case 4:
        this.setVelocityX(0);
        this.play('left-walk');
        this.flipX = true;
        this.setVelocityX(-8);
        break;

      default:
        break;
    }
  }
}