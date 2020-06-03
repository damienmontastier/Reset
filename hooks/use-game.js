import useWebGL from '@/hooks/use-webgl'
import useCamera from '@/hooks/use-camera'
import useRAF from '@/hooks/use-raf'

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
    const { scene } = useWebGL()
    const { camera } = useCamera()

    camera.originPosition = new THREE.Vector3(1.1, 6, 6).normalize()
    camera.distance = 7

    camera.position.copy(
      camera.originPosition.clone().multiplyScalar(camera.distance)
    )

    camera.lookAt(scene.position.clone())
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
