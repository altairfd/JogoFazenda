import { Scene } from 'phaser';
import { CONFIG } from '../config';
import Player from '../entities/Player';

export default class Fazenda extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;

  layers = {};

  constructor() {
    super('Fazenda');
  }

  preload() {

    //Carregando o JSON do mapa
    this.load.tilemapTiledJSON('fazenda', '../mapas/fazenda.json');
    this.load.image('tiles-geral', '../mapas/tiles/geral.png');

    //Importando um spriteseet
    this.load.spritesheet('Player', '../mapas/tiles/player.png', {
      frameWidth: CONFIG.TILE_SIZE * 2,
      frameHeight: CONFIG.TILE_SIZE * 2
    })

  }

  create() {
    this.createMap();
    this.createLayers();
    this.createPlayer();
    this.createCollider();
  }

  update() {

  }

  createMap() {
    this.map = this.make.tilemap({
      key: 'fazenda',
      tileWidth: CONFIG.TILE_SIZE,
      tileHeight: CONFIG.TILE_SIZE,
    })

    this.map.addTilesetImage('geral', 'tiles-geral');
  }

  createLayers() {
    const tilesGeral = this.map.getTileset('geral')
    
    const layerNames = this.map.getTileLayerNames();

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

    createPlayer() {
      this.player = new Player(this, 22 * 10, 18 * 5)
      this.player.setDepth(1);
    }

    createCollider() {
      const layerNames = this.map.getTileLayerNames();
      for (let i = 0; i < layerNames.length; i++) {
        const name = layerNames[i];

        if (name.endsWith('Colision')) {
          this.physics.add.collider(this.player, this.layers[name]);
        }
      }
    }
  }