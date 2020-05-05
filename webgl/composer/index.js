import {
  EffectComposer,
  // EffectPass,
  RenderPass,
  ShaderPass
  // NormalPass
} from 'postprocessing'

// import OutlineEffect from './effects/outline'
// import AntialiasingEffect from './effects/antialiasing'
// import DitheringEffect from './effects/dithering'

// import HightlightCircleEffect from './effects/hightlight-circle'

import viewport from '@/plugins/viewport'

import useGUI from '@/hooks/use-gui'

export default class Composer {
  constructor({ renderer, camera, scene, wireframeScene }) {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.wireframeScene = wireframeScene

    this.init()
  }

  init() {
    this.initWireframeComposer()
    this.initComposer()
    this.initGUI()
  }

  initWireframeComposer() {
    this.wireframeRenderTarget = new THREE.WebGLRenderTarget({
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    })

    this.wireframeComposer = new EffectComposer(
      this.renderer,
      this.wireframeRenderTarget
    )
    const renderPass = new RenderPass(this.wireframeScene, this.camera)

    renderPass.renderToScreen = false

    this.wireframeComposer.addPass(renderPass)
  }

  initComposer() {
    this.sceneRenderTarget = new THREE.WebGLRenderTarget({
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    })

    // composer
    this.composer = new EffectComposer(this.renderer, this.sceneRenderTarget)

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv;

        void main() {
        
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        
        }`,
        fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tAdd;
        
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D( tDiffuse, vUv );
          vec4 add = texture2D( tAdd, vUv );
          // gl_FragColor = vec4(vec3(1.0,1.,0.),add.a);
          gl_FragColor = texel;
        }`,
        transparent: true,
        uniforms: {
          tDiffuse: { type: 't', value: 0, texture: null },
          tAdd: { type: 't', value: 1, texture: null },
          fCoeff: { type: 'f', value: 1.0 }
        }
      })
    )
    finalPass.needsSwap = true
    finalPass.renderToScreen = true
    finalPass.setInput('tDiffuse')
    finalPass.screen.material.uniforms.tAdd.value = this.wireframeComposer.outputBuffer.texture

    // this.hightlightCircleEffect = new HightlightCircleEffect({
    //   wireframeBuffer: this.wireframeComposer.outputBuffer.texture
    // })

    // this.hightlightCirclePass = new EffectPass(
    //   this.camera,
    //   this.hightlightCircleEffect
    // )

    // addPasses
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    // this.composer.addPass(this.hightlightCirclePass)
    this.composer.addPass(finalPass)
  }

  render(clock) {
    this.renderer.clear()

    this.renderer.setSize(viewport.width, viewport.height)
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
