import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";


export default class Casa extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;
  touch;
  isTouching = false;
  layers = {};

  grupObject;
  constructor() {
    super('Casa')
  }

  preload() {
    //Carregando o JSON do mapa
    this.load.tilemapTiledJSON('casa', '../mapas/Casa.json');
    this.load.image('tiles-geral', '../mapas/tiles/geral.png');

    //Importando um spriteseet
    this.load.spritesheet('Player', '../mapas/tiles/player.png', {
      frameWidth: CONFIG.TILE_SIZE * 3,
      frameHeight: CONFIG.TILE_SIZE * 3
    })
  }

  create() {
    this.createMap();
    this.createLayers();
    this.createPlayer();
    this.createObject();
    this.createCollider();
  }

  update() {

  }

  createMap() {
    this.map = this.make.tilemap({
      key: 'casa',
      tileWidth: CONFIG.TILE_SIZE,
      tileHeight: CONFIG.TILE_SIZE,
    })

    this.map.addTilesetImage('geral', 'tiles-geral');
  }

  createPlayer() {
    this.touch = new Touch(this, 22 * 11, 18 * 13);
    this.player = new Player(this, 22 * 11, 18 * 13, this.touch);
    this.player.setDepth(4);
  }

  createLayers() {
    const tilesGeral = this.map.getTileset('geral')

    const layerNames = this.map.getTileLayerNames();
    console.log(layerNames)
    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];

      this.layers[name] = this.map.createLayer(name, [tilesGeral], 0, 0);

      //Definindo a propriedade para camada
      this.layers[name].setDepth(i);

      //Veiricando se a camada possui colisão
      if (name.endsWith('Colision')) {
        this.layers[name].setCollisionByProperty({ colider: true })
      }
    }
  }

  createCollider() {
    const layerNames = this.map.getTileLayerNames();
    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];

      if (name.endsWith('Colision')) {
        this.physics.add.collider(this.player, this.layers[name]);
      }
    }

    this.physics.add.overlap(this.touch, this.grupObject, this.handleTouch, undefined, this);
  }

  createObject() {
    this.grupObject = this.physics.add.group();
    const objects = this.map.createFromObjects('Objeto', {
      name: 'PortaCasa'
    });

    this.physics.world.enable(objects);

    for (let i = 0; i < objects.length; i++) {
      //Pegando o objeto atual
      const obj = objects[i]

      //Pegando as informações do Objeto definidas no Tiled
      const prop = this.map.objects[0].objects[i]

      obj.setDepth(this.layers.length + 1);
      obj.setVisible(false);
      obj.prop = this.map.objects[0].objects[i].properties;

      this.grupObject.add(obj);
    }
  }

  handleTouch(touch, object) {
    if (this.isTouching && this.player.isAction) {
      return;
    }

    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }

    if (this.player.isAction) {
      if (object.name === 'PortaCasa') {
        console.log('Toc toc')
        this.scene.switch('Fazenda')
      }
    }
  }
}