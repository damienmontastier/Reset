import {
  EffectComposer,
  EffectPass,
  RenderPass
  // NormalPass
} from 'postprocessing'

// import OutlineEffect from './effects/outline'
// import AntialiasingEffect from './effects/antialiasing'
// import DitheringEffect from './effects/dithering'

import HightlightCircleEffect from './effects/hightlight-circle'

import viewport from '@/plugins/viewport'

import useGUI from '@/hooks/use-gui'

export default class Composer {
  constructor({ renderer, camera, scene, wireframeScene }) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.wireframeScene = wireframeScene

    this.renderingScale = 1

    this.init()
  }

  init() {
    this.initWireframeComposer()
    this.initComposer()
    this.initGUI()
  }

  initWireframeComposer() {
    this.wireframeSceneRenderTarget = new THREE.WebGLRenderTarget({
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    })

    this.wireframeComposer = new EffectComposer(
      this.renderer,
      this.wireframeSceneRenderTarget
    )
    const renderPass = new RenderPass(this.wireframeScene, this.camera)

    this.wireframeComposer.addPass(renderPass)

    renderPass.renderToScreen = false
  }

  initComposer() {
    // effects
    // this.antialiasingEffect = await new AntialiasingEffect()

    // this.normalPass = new NormalPass(this.scene, this.camera)
    // this.outlineEffect = new OutlineEffect(
    //   this.normalPass.renderTarget.texture,
    //   {
    //     step: 0.01,
    //     outlineColor: 0x00ff00
    //   }
    // )

    // composer
    this.composer = new EffectComposer(this.renderer)

    // passes
    // this.effectPass = new EffectPass(this.camera, this.outlineEffect)

    // this.AAPass = new EffectPass(
    //   this.camera,
    //   this.antialiasingEffect.smaaEffect
    // )

    // this.ditheringEffect = new DitheringEffect()
    // this.ditheringPass = new EffectPass(this.camera, this.ditheringEffect)

    this.hightlightCircleEffect = new HightlightCircleEffect({
      wireframeBuffer: this.wireframeComposer.outputBuffer.texture
    })

    this.hightlightCirclePass = new EffectPass(
      this.camera,
      this.hightlightCircleEffect
    )

    // addPasses
    // this.composer.addPass(this.normalPass)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(this.hightlightCirclePass)
    // this.composer.addPass(this.AAPass)
    // this.composer.addPass(this.ditheringPass)
  }

  renderWireframe() {}

  render(clock) {
    this.renderer.setSize(
      viewport.width * this.renderingScale,
      viewport.height * this.renderingScale
    )
    this.renderer.setPixelRatio = window.devicePixelRatio || 1

    this.wireframeComposer.setSize(viewport.width, viewport.height)
    this.wireframeComposer.render(clock.deltaTime)

    if (this.composer) {
      this.composer.setSize(viewport.width, viewport.height)
      this.composer.render(clock.deltaTime)
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  initGUI() {
    const gui = useGUI()

    const composer = this.composer
    const renderer = composer.getRenderer()
    const context = renderer.getContext()

    const effectPass = this.effectPass

    const AAMode = Object.assign(
      {
        DISABLED: 0,
        SMAA: 1
      },
      !renderer.capabilities.isWebGL2
        ? {}
        : {
            MSAA: 2
          }
    )

    const AAparams = {
      antialiasing: AAMode.SMAA
    }

    gui.postprocessing.add(AAparams, 'antialiasing', AAMode).onChange(() => {
      const mode = Number(AAparams.antialiasing)

      effectPass.enabled = mode === AAMode.SMAA

      composer.multisampling =
        mode === AAMode.MSAA
          ? Math.min(4, context.getParameter(context.MAX_SAMPLES))
          : 0
    })

    gui.rendering
      .add(this, 'renderingScale')
      .min(0.2)
      .max(1)
      .step(0.1)

    if (this.outlineEffect) {
      const sobelGUI = gui.postprocessing.addFolder('outline')
      const color = new THREE.Color()
      const outlineParams = {
        'outline color': color
          .copyLinearToSRGB(
            this.outlineEffect.uniforms.get('outlineColor').value
          )
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
  }
}
