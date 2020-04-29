import gsap from 'gsap'
import RAF from '@/assets/js/raf'
import useGUI from '@/hooks/use-gui'

let raf

const useRAF = () => {
  if (!raf) {
    raf = new RAF()

    gsap.ticker.lagSmoothing(0)
    gsap.globalTimeline.pause()

    raf.add(
      'use-raf',
      (clock) => {
        const time = gsap.globalTimeline.time()
        gsap.globalTimeline.time(time + clock.deltaTime)
      },
      -1
    )

    const gui = useGUI()
    gui.rendering
      .add(raf, 'fps')
      .min(0)
      .max(60)
  }
  return raf
}

export default useRAF
