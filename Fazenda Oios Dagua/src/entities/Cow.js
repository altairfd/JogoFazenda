//Vaca
export default class Cow extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'Cow');
    scene.add.existing(this) //Criando imagem da vaca
    scene.physics.add.existing(this); //Criando a fisica
    this.init();
  }

  init() {
    this.setFrame(0);
    this.frameRate = 6;
    this.direction = 'idie';
    this.setOrigin(0, .5);
    this.body.setSize(10, 10);
    this.setVelocity(0);
    // this.body.setOffset(20, 15);
    this.initAnimation();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    this.play('idle');
  }

  initAnimation() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('Cow', {
        start: 0, end: 2
      }),
      frameRate: this.frameRate,
      repeat: -1
    })
  }
}