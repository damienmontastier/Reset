import {
  EffectComposer,
  // EffectPass,
  RenderPass,
  // SelectiveBloomEffect,
  BloomEffect,
  EffectPass,
  KernelSize,
  BlendFunction
  // NormalPass
} from 'postprocessing'

// import OutlineEffect from './effects/outline'
import AntialiasingEffect from './effects/antialiasing'
import NoiseEffect from './effects/noise'
// import DitheringEffect from './effects/dithering'

// import HightlightCircleEffect from './effects/hightlight-circle'

import viewport from '@/plugins/viewport'

import useGUI from '@/hooks/use-gui'

export default class Composer {
  constructor({ renderer, camera, scene }) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene

    this.init()
  }

  async init() {
    this.quality = 'high'
    await this.initComposer()
    this.initGUI()
  }

  async initComposer() {
    // composer
    this.composer = new EffectComposer(this.renderer)
    this.composer.autoRenderToScreen = false

    // effects
    // this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
    //   blendFunction: BlendFunction.SCREEN,
    //   kernelSize: KernelSize.MEDIUM,
    //   luminanceThreshold: 0.8,
    //   luminanceSmoothing: 0.075,
    //   height: 480
    // })

    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.HUGE,
      intensity: 0.6,
      luminanceThreshold: 0,
      luminanceSmoothing: 1,
      height: 1080
    })

    this.AAEffect = await new AntialiasingEffect()

    this.noiseEffect = new NoiseEffect({ intensity: 0.1 })

    // passes
    this.bloomPass = new EffectPass(this.camera, this.bloomEffect)
    this.bloomPass.name = 'BloomPass'
    this.bloomPass.renderToScreen = true

    this.AAPass = new EffectPass(
      this.camera,
      this.AAEffect.smaaEffect,
      this.noiseEffect
    )
    this.AAPass.name = 'AAPass'

    // addPasses
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(this.AAPass)
    this.composer.addPass(this.bloomPass)
  }

  render(clock) {
    if (this.noiseEffect) {
      this.swap = (this.swap || 0) + 1
      if (this.swap % 5 === 0) {
        this.swap = 0
        this.noiseEffect.uniforms.get('offset').value = Math.random()
      }
    }

    this.renderer.clear()

    this.renderer.setSize(viewport.width, viewport.height)
    this.renderer.setPixelRatio = window.devicePixelRatio || 1

    if (this.composer && !this.disabled) {
      this.composer.setSize(viewport.width, viewport.height)
      this.composer.render(clock.deltaTime)
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  setQuality(quality) {
    this.quality = quality

    switch (this.quality) {
      case 'low':
        this.disabled = true
        break
      case 'medium':
        this.disabled = false

        if (this.composer.passes.some((pass) => pass.name === 'BloomPass')) {
          this.composer.removePass(this.bloomPass)

          const lastIndex = this.composer.passes.length - 1
          this.composer.passes[lastIndex].renderToScreen = true
        }

        break
      case 'high':
        this.disabled = false

        if (!this.composer.passes.some((pass) => pass.name === 'BloomPass')) {
          const lastIndex = this.composer.passes.length - 1
          this.composer.passes[lastIndex].renderToScreen = false

          this.composer.addPass(this.bloomPass)
          this.bloomPass.renderToScreen = true
        }

        break
      default:
        break
    }
  }

  initGUI() {
    if (this.bloomEffect) {
      this.initBloomGUI()
    }

    if (this.noiseEffect) {
      this.initNoiseGUI()
    }

    this.initQualityGUI()
  }

  initQualityGUI() {
    const GUI = useGUI()

    GUI.rendering
      .add(this, 'quality', ['low', 'medium', 'high'])
      .onChange(() => {
        this.setQuality(this.quality)
      })
  }

  initBloomGUI() {
    const GUI = useGUI()
    const bloomGUI = GUI.postprocessing._addFolder('Bloom')

    const bloomParams = {
      resolution: this.bloomEffect.resolution.height,
      'kernel size': this.bloomEffect.blurPass.kernelSize,
      'blur scale': this.bloomEffect.blurPass.scale,
      intensity: this.bloomEffect.intensity,
      luminance: {
        filter: this.bloomEffect.luminancePass.enabled,
        threshold: this.bloomEffect.luminanceMaterial.threshold,
        smoothing: this.bloomEffect.luminanceMaterial.smoothing
      }
    }

    bloomGUI
      .add(bloomParams, 'resolution', [240, 360, 480, 720, 1080])
      .onChange(() => {
        this.bloomEffect.resolution.height = Number(bloomParams.resolution)
      })

    bloomGUI.add(bloomParams, 'kernel size', KernelSize).onChange(() => {
      this.bloomEffect.blurPass.kernelSize = Number(bloomParams['kernel size'])
    })

    bloomGUI
      .add(bloomParams, 'blur scale')
      .min(0.0)
      .max(1.0)
      .step(0.01)
      .onChange(() => {
        this.bloomEffect.blurPass.scale = Number(bloomParams['blur scale'])
      })

    bloomGUI
      .add(bloomParams, 'intensity')
      .min(0.0)
      .max(3.0)
      .step(0.01)
      .onChange(() => {
        this.bloomEffect.intensity = Number(bloomParams.intensity)
      })

    const luminanceGUI = bloomGUI._addFolder('Luminance')

    luminanceGUI.add(bloomParams.luminance, 'filter').onChange(() => {
      this.bloomEffect.luminancePass.enabled = bloomParams.luminance.filter
    })

    luminanceGUI
      .add(bloomParams.luminance, 'threshold')
      .min(0.0)
      .max(1.0)
      .step(0.001)
      .onChange(() => {
        this.bloomEffect.luminanceMaterial.threshold = Number(
          bloomParams.luminance.threshold
        )
      })

    luminanceGUI
      .add(bloomParams.luminance, 'smoothing')
      .min(0.0)
      .max(1.0)
      .step(0.001)
      .onChange(() => {
        this.bloomEffect.luminanceMaterial.smoothing = Number(
          bloomParams.luminance.smoothing
        )
      })
  }

  initNoiseGUI() {
    const GUI = useGUI()
    const noiseGUI = GUI.postprocessing._addFolder('Noise')

    noiseGUI
      .add(this.noiseEffect.uniforms.get('intensity'), 'value')
      .step(0.01)
      .name('intensity')
  }
}
