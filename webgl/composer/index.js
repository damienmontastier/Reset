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
// import AntialiasingEffect from './effects/antialiasing'
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

  init() {
    this.initComposer()
    this.initGUI()
  }

  initComposer() {
    // composer
    this.composer = new EffectComposer(this.renderer)

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
      kernelSize: KernelSize.MEDIUM,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.075,
      height: 480
    })

    // passes
    this.bloomPass = new EffectPass(this.camera, this.bloomEffect)

    // addPasses
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    // this.composer.addPass(this.bloomPass)
  }

  render(clock) {
    this.renderer.clear()

    this.renderer.setSize(viewport.width, viewport.height)
    this.renderer.setPixelRatio = window.devicePixelRatio || 1

    // if (this.composer && !this.disabled) {
    //   this.composer.setSize(viewport.width, viewport.height)
    //   this.composer.render(clock.deltaTime)
    // } else {
    this.renderer.render(this.scene, this.camera)
    // }
  }

  initGUI() {
    if (this.outlineEffect) {
      this.initSobelGUI()
    }

    if (this.bloomEffect) {
      this.initBloomGUI()
    }
  }

  initSobelGUI() {
    const GUI = useGUI()

    const sobelGUI = GUI.postprocessing.addFolder('outline')
    const color = new THREE.Color()
    const outlineParams = {
      'outline color': color
        .copyLinearToSRGB(this.outlineEffect.uniforms.get('outlineColor').value)
        .getHex()
    }

    sobelGUI
      .add(this.outlineEffect.uniforms.get('step'), 'value')
      .name('step')
      .step(0.001)

    // sobelGUI
    //   .add(this.outlineEffect.uniforms.get('threshold'), 'value')
    //   .name('threshold')

    sobelGUI.addColor(outlineParams, 'outline color').onChange(() => {
      this.outlineEffect.uniforms
        .get('outlineColor')
        .value.setHex(outlineParams['outline color'])
        .convertSRGBToLinear()
    })
  }

  initBloomGUI() {
    const GUI = useGUI()
    const bloomGUI = GUI.postprocessing.addFolder('Bloom')

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

    const luminanceGUI = bloomGUI.addFolder('Luminance')

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
}
