import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Loader from './loader'
import global from './data/global.json'

export default class Manager {
  constructor() {
    const gltfLoader = new GLTFLoader()

    this.loader = new Loader({
      rules: [
        {
          test: /\.(?:glb|gltf)/,
          loader: gltfLoader
        },
        {
          test: /\.(?:obj)/,
          loader: new OBJLoader()
        },
        {
          test: /\.(?:png|jpg|jpeg)/,
          loader: new THREE.TextureLoader()
        },
        {
          test: /\..*?/,
          loader: new THREE.FileLoader()
        }
      ]
    })

    this.loader.addGroup(global)
    // this.loader.loadGroup('global')
  }

  get(name, synchronous = false) {
    this.loader.loadGroup(name)
    return this.loader.get(name, synchronous)
  }
}
