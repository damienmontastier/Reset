import gsap from 'gsap'

// import useGUI from '@/hooks/use-gui'

import CheckpointMaterial from '@/webgl/materials/checkpoint'

export default class Checkpoint extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(0.95)
    this.geometry = new THREE.PlaneBufferGeometry(1, 1)
    this.material = new CheckpointMaterial({ color: 0xffffff })

    // const GUI = useGUI()

    this.face1 = new THREE.Mesh(this.geometry, this.material)
    this.face2 = this.face1.clone()
    this.face3 = this.face1.clone()
    this.face4 = this.face1.clone()

    this.face1.position.z = 0.5

    this.face2.rotation.y = THREE.MathUtils.degToRad(90)
    this.face2.position.x = 0.5

    this.face3.rotation.y = 6.3
    this.face3.position.z = -0.5

    this.face4.rotation.y = THREE.MathUtils.degToRad(-270)
    this.face4.position.x = -0.5

    this.add(this.face1)
    this.add(this.face2)
    this.add(this.face3)
    this.add(this.face4)

    this.matrixAutoUpdate = false
  }

  trigger() {
    gsap.to([this.material.uniforms.uColor.value], {
      ease: 'expo.out',
      duration: 2,
      r: 0,
      g: 1,
      b: 0
    })
  }
}
