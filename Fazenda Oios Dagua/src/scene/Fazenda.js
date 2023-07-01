import { Scene, Math } from 'phaser';
import { CONFIG } from '../config';
import Player from '../entities/Player';
import Cow from '../entities/Cow';
import Touch from '../entities/Touch';
import Casa from './Casa';


export default class Fazenda extends Scene {
  /**@type {Phaser.Tilemaps.Tilemap} */
  map;

  /**@type {Player} */
  player;
  touch;

  grupObject;
  isTouching = false;
  cow;
  cow2;

  layers = {};

  //Regador
  regas = false;

  //Maca
  macaPlantada = false;
  macaState = 0;
  semiMaca = false;

  //Estelar
  estelarPlantada = false;
  estelarState = 0;
  semiEstelar = false;
  estelarRegada = false;

  //Cenoura
  cenouraPlantada = false;
  cenouraState = 0;
  semiCenoura = false;
  cenouraRegada = false;

  constructor() {
    super('Fazenda');
  }

  preload() {

    //Carregando o JSON do mapa
    this.load.tilemapTiledJSON('fazenda', '../mapas/fazenda.json');
    this.load.image('tiles-geral', '../mapas/tiles/geral.png');

    //Importando um spriteseet
    this.load.spritesheet('Player', '../mapas/tiles/player.png', {
      frameWidth: CONFIG.TILE_SIZE * 3,
      frameHeight: CONFIG.TILE_SIZE * 3
    })

    this.load.spritesheet('Cow', '../mapas/tiles/vacas_anim.png', {
      frameWidth: CONFIG.TILE_SIZE * 2,
      frameHeight: CONFIG.TILE_SIZE * 2
    })

    this.load.spritesheet('geral', '../mapas/tiles/geral.png', {
      frameWidth: CONFIG.TILE_SIZE,
      frameHeight: CONFIG.TILE_SIZE
    })

  }

  create() {
    this.createMap();
    this.createLayers();
    this.createPlayer();
    this.createCow();
    this.createObject();
    this.createCamera();
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

  createPlayer() {
    this.touch = new Touch(this, 22 * 10, 18 * 5);
    this.player = new Player(this, 22 * 10, 18 * 5, this.touch);
    this.player.setDepth(4);
  }

  createCow() {
    this.cow = new Cow(this, 16 * 24, 16 * 20);
    this.cow.setDepth(4);

    this.cow2 = new Cow(this, 16 * 20, 16 * 22);
    this.cow2.setDepth(4);

  }

  createObject() {
    this.grupObject = this.physics.add.group();
    const objects = this.map.createFromObjects('Terreno', 'Terreno', 'Terreno', 'Terreno', 'Terreno', 'Terreno', 'Terreno', 'Terreno', {
      name: 'Maca', name: 'semiMaca', name: 'Regas', name: 'Estelar', name: 'semiEstelar', name: 'Cenoura', name: 'semiCenoura', name: 'Porta'
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

  createCollider() {
    const layerNames = this.map.getTileLayerNames();
    for (let i = 0; i < layerNames.length; i++) {
      const name = layerNames[i];

      if (name.endsWith('Colision')) {
        this.physics.add.collider(this.player, this.layers[name]);
        this.physics.add.collider(this.cow, this.layers[name]);
        this.physics.add.collider(this.cow2, this.layers[name]);
        this.physics.add.collider(this.player, this.cow);
        this.physics.add.collider(this.player, this.cow2);
      }
    }
    this.physics.add.overlap(this.touch, this.grupObject, this.handleTouch, undefined, this);
  }

  createCamera() {
    const mapWidth = this.map.width * CONFIG.TILE_SIZE;
    const mapHeight = this.map.height * CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, mapHeight * CONFIG.TILE_SIZE, mapWidth * CONFIG.TILE_SIZE)
    this.cameras.main.startFollow(this.player);
  }

  handleTouch(touch, object) {
    if (this.isTouching && this.player.isAction) {
      return;
    }

    if (this.isTouching && !this.player.isAction) {
      this.isTouching = false;
      return;
    }


    //Mudando a cena para CASA
    if (this.player.isAction) {
      if (object.name === 'Porta') {
        console.log(Casa)
        this.scene.switch('Casa')
      }
    }

    //Pegou a semente MACA
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'semiMaca') {
        this.semiMaca = true;
        console.log('pegando a semente')
      }
    }

    // Plantando uma maçanzinha
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Maca' && this.semiMaca === true) {
        const plantMaca = this.physics.add.sprite(object.x, object.y, 'geral')
          .setDepth(0)
        plantMaca.setFrame(632)
        this.macaPlantada = true;
        this.macaRegada = false;
        console.log('pegando a semente')
      }
    }

    //Regas
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Regas' && this.regas === false) {
        console.log('Regas na mao')
        this.regas = true;
      }
    }

    // Segunda parte da MACA
    if (this.player.isAction) {
      if (object.name === 'Maca' && this.regas === true && this.macaPlantada === true && this.macaState === 0) {
        setTimeout(() => {
          const plantMaca = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantMaca.setFrame(633);
          console.log('maca regas')
        }, 3000);
        this.macaPlantada = true;
        this.regas = false;
        this.macaState = 1;
      }
    }

    // Terceira fase da MACA
    if (this.player.isAction) {
      if (object.name === 'Maca' && this.regas === true && this.macaPlantada === true && this.macaState === 1) {
        console.log('entrei na segunda faze apos molhar')
        setTimeout(() => {
          const plantMaca = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantMaca.setFrame(634);
          console.log('maca regas')
        }, 3000)
        this.macaPlantada = true;
        this.regas = false;
        this.macaState = 2;
      }
    }

    // Quarta fase da MACA
    if (this.player.isAction) {
      if (object.name === 'Maca' && this.regas === true && this.macaPlantada === true && this.macaState === 2) {
        console.log('entrei na segunda faze apos molhar')
        setTimeout(() => {
          const plantMaca = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantMaca.setFrame(635);
          console.log('maca regas')
        }, 3000)
        this.macaPlantada = true;
        this.regas = false;
        this.macaState = 0;
      }
    }

    //Pegou a semente ESTELAR
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'semiEstelar') {
        this.semiEstelar = true;
        this.semiMaca = false;
        console.log('pegando a semente')
      }
    }

    //Plantando uma ESTELARZINHA
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Estelar' && this.semiEstelar === true) {
        const plantaEstelar = this.physics.add.sprite(object.x, object.y, 'geral')
          .setDepth(0)
        plantaEstelar.setFrame(848)
        this.estelarPlantada = true;
        this.estelarRegada = false;
        console.log('plantou estelar')
      }
    }

    //Segunda fase ESTELAR
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Estelar' && this.estelarPlantada === true && this.regas === true && this.estelarState === 0) {
        setTimeout(() => {
          const plantaEstelar = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantaEstelar.setFrame(849);
          console.log('estelar regada')
        }, 3000);
        this.estelarPlantada = true;
        this.regas = false;
        this.estelarState = 1;
      }
    }

    //Terceira fase ESTELAR
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Estelar' && this.estelarPlantada === true && this.regas === true && this.estelarState === 1) {
        setTimeout(() => {
          const plantaEstelar = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantaEstelar.setFrame(850);
          console.log('estelar segunda fase')
        }, 3000);
        this.estelarPlantada = true;
        this.regas = false;
        this.estelarState = 2;
      }
    }

    //Quarta fase ESTELAR
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Estelar' && this.estelarPlantada === true && this.regas === true && this.estelarState === 2) {
        setTimeout(() => {
          const plantaEstelar = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
          plantaEstelar.setFrame(851);
          console.log('estelar segunda fase')
        }, 3000);
        this.estelarPlantada = true;
        this.regas = false;
        this.estelarState = 2;
      }
    }

    //Plantando cenoura
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'semiCenoura') {
        this.semiCenoura = true;
        this.semiMaca = false;
        this.semiEstelar = false;
        console.log('pegando a semente cenoura')
      }
    }

    //Plantando uma cenourinha
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Cenoura' && this.semiCenoura === true) {
        const plantCenoura = this.physics.add.sprite(object.x, object.y, 'geral')
          .setDepth(0)
          plantCenoura.setFrame(584)
        this.cenouraPlantada = true;
        this.cenouraRegada = false;
        console.log('plantou cenoura')
      }
    }

    //Segunda fase CENOURA
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Cenoura' && this.cenouraPlantada === true && this.regas === true && this.cenouraState === 0) {
        setTimeout(() => {
          const plantCenoura = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
            plantCenoura.setFrame(585);
          console.log('cenoura regada')
        }, 3000);
        this.cenouraPlantada = true;
        this.regas = false;
        this.cenouraState = 1;
      }
    }

    //Terceira fase Cenoura
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Cenoura' && this.cenouraPlantada === true && this.regas === true && this.cenouraState === 1) {
        setTimeout(() => {
          const plantCenoura = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
            plantCenoura.setFrame(586);
          console.log('cenoura segunda fase')
        }, 3000);
        this.cenouraPlantada = true;
        this.regas = false;
        this.cenouraState = 2;
      }
    }

    //Quarta fase cenoura
    if (this.player.isAction) {
      this.isTouching = true;
      if (object.name === 'Cenoura' && this.cenouraPlantada === true && this.regas === true && this.cenouraState === 2) {
        setTimeout(() => {
          const plantCenoura = this.physics.add.sprite(object.x, object.y, 'geral')
            .setDepth(0)
            plantCenoura.setFrame(587);
          console.log('cenoura segunda fase')
        }, 3000);
        this.cenouraPlantada = true;
        this.regas = false;
        this.cenouraState = 2;
      }
    }
  }
}