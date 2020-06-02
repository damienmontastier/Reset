import useWebGL from '@/hooks/use-webgl'
// import useCamera from '@/hooks/use-camera'
import useRAF from '@/hooks/use-raf'

let intro

class Introduction {
  constructor() {
    this.scene = new THREE.Group()

    const { scene } = useWebGL()
    scene.add(this.scene)

    this.init()
  }

  init() {
    this.initCamera()

    const RAF = useRAF()
    RAF.add('use-intro', this.loop.bind(this), 1)
  }

  initCamera() {
    // const { scene } = useWebGL()
    // const { camera } = useCamera()
  }

  loop() {
    const { clock } = useWebGL()
    clock.getDelta()
  }

  destroy() {
    const RAF = useRAF()
    RAF.remove('use-intro')

    const { scene } = useWebGL()
    scene.remove(this.scene)
  }
}

const useIntro = () => {
  return intro || (intro = new Introduction())
}

export default useIntro
