import useWebGL from '@/hooks/use-webgl'
// import useCamera from '@/hooks/use-camera'
import useRAF from '@/hooks/use-raf'
// import useGUI from '@/hooks/use-gui'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

let game

class Game {
  constructor() {
    this.scene = new THREE.Group()

    const { scene } = useWebGL()
    scene.add(this.scene)

    this.intersections = new INTERSECTIONS.World()
    // scene.add(this.intersections)

    this.init()
  }

  init() {
    this.initCamera()

    const RAF = useRAF()
    RAF.add('use-game', this.loop.bind(this), 1)
  }

  initCamera() {
    // const { scene } = useWebGL()
    // const { camera } = useCamera()
    // this.scene.add(camera)
    // camera._normalizedAngle = new THREE.Vector3(1.1, 6, 6).normalize()
    // camera._distance = 7
    // camera._angle = camera._normalizedAngle
    //   .clone()
    //   .multiplyScalar(camera._distance)
    // console.log(camera._angle)
    // camera.position.copy(
    //   camera.originPosition.clone().multiplyScalar(camera.distance)
    // )
    // camera.lookAt(this.scene.position.clone())
    // const GUI = useGUI()
    // GUI.addObject3D('camera', camera)
  }

  loop() {
    const { clock } = useWebGL()
    clock.getDelta()

    // const time = clock.getElapsedTime()

    this.frameCount = (this.frameCount || 0) + 1
    if (this.frameCount % 2 === 0) this.intersections.step()
  }

  destroy() {
    const RAF = useRAF()
    RAF.remove('use-game')

    const { scene } = useWebGL()
    scene.remove(this.scene)
  }
}

const useGame = () => {
  return game || (game = new Game())
}

export default useGame
