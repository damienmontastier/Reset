import gsap from 'gsap'

import Treadmill from './treadmill'

import PostsInstances from '@/game/components/posts-instances'
import DotsPlane from '@/webgl/components/dots-plane'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'
// import useRAF from '@/hooks/use-raf'
// import useKeyboard from '@/hooks/use-keyboard'

import keyboard from '@/plugins/keyboard'

import BoxGeometry from '@/webgl/geometries/box'
import Checkpoint from '@/webgl/components/checkpoint'

// import GreenMaterial from '@/webgl/materials/green'
// import BlackMaterial from '@/webgl/materials/black'
import SignScreenMaterial from '@/webgl/materials/sign-screen'
import TerminalScreenMaterial from '@/webgl/materials/terminal-screen'
import standardMaterial from '@/webgl/materials/standard'
import BasicMaterial from '@/webgl/materials/basic'

import LIGHT_CONFIG from '@/config/light'
import LEVEL01_CONFIG from '@/config/level01'

export default class Level01 extends THREE.Object3D {
  async load() {
    // materials
    this.standardMaterial = standardMaterial.clone()
    this.greenMaterial = new THREE.MeshBasicMaterial({
      color: 0x2ff000,
      transparent: true
    })
    this.greenWireframeMaterial = new BasicMaterial({ color: 0x2ff000 })

    // this.solidGreenMaterial = new THREE.MeshBasicMaterial({ color: 0x2ff000 })

    this.blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true
    })
    this.blackWireframeMaterial = new BasicMaterial({ color: 0x000000 })

    const GUI = useGUI()
    GUI.addMaterial('solid material', this.standardMaterial)
    GUI.add(this.greenWireframeMaterial.uniforms.uAppear, 'value')
      .min(0)
      .max(1)
      .step(0.01)
      .name('green appear')

    GUI.add(this.greenMaterial, 'alphaTest')
      .min(0)
      .max(1)
      .step(0.01)
      .name('green alphatest')

    GUI.add(this.greenMaterial, 'depthFunc')
      .min(0)
      .max(10)
      .step(1)
      .name('green depthFunc')

    GUI.add(this.greenMaterial, 'blendSrc')
      .min(0)
      .max(300)
      .step(1)
      .name('green blendSrc')

    GUI.add(this.greenMaterial, 'blendSrc')
      .min(0)
      .max(300)
      .step(1)
      .name('green blendDst')

    GUI.add(this.greenMaterial, 'depthTest').name('green depthTest')

    GUI.add(this.greenMaterial, 'depthWrite').name('green depthWrite')

    GUI.add(this.greenMaterial, 'transparent').name('green transparent')

    GUI.add(this.blackWireframeMaterial.uniforms.uAppear, 'value')
      .min(0)
      .max(1)
      .step(0.01)
      .name('black appear')

    GUI.add(this, 'appear').name('trigger appear')
    // materials

    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level_01',
      base: '/',
      files: [
        {
          name: 'goal',
          path: 'obj/level_01/usb.glb'
        },
        {
          name: 'solid',
          path: 'obj/level_01/level01_20.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/level_01/level01_wireframe_10.obj'
        },
        {
          name: 'debug_solid',
          path: 'obj/debug/debug_solid.glb'
        },
        {
          name: 'debug_wireframe',
          path: 'obj/debug/debug_wireframe.obj'
        }
      ]
    })

    this.files = await assetsManager.get('level_01')

    this.solid = this.files.solid.scene
    this.wireframe = this.files.wireframe

    this.add(this.solid)
    this.add(this.wireframe)

    await PostsInstances.load()

    // instances
    await this.replaceInstances()

    // this.wireframe.scale.setScalar(1.1)

    this.init()
  }

  init() {
    this.paused = false
    keyboard.events.on('keydown', (e) => {
      // SHIFT+P to stop
      if (e.keyCode === 80 && e.shiftKey) {
        this.paused = !this.paused
        console.log('paused')
      }
    })

    // spawn point
    this.spawnPoint = this.solid
      .getObjectByName('zone_spawn')
      .position.clone()
      .add(new THREE.Vector3(-0.5, 0, 0))

    this.initLights()
    this.applyMaterials()
    this.initBackground()
    this.initTreadmillsHitboxes()

    this.initUSB()

    // const appearTl = this.appear()
    // appearTl.pause()

    // setTimeout(() => {
    //   appearTl.play()
    // }, 3000)

    // const RAF = useRAF()
    // RAF.add('level_01', this.update.bind(this), 0)
  }

  initUSB() {
    // const geometry = new THREE.BoxBufferGeometry(1, 1)
    // const material = new THREE.MeshNormalMaterial()

    // const goalZone = new THREE.Mesh(geometry, material)
    // goalZone.name = 'zone_goal'
    // this.zones.add(goalZone)

    // goalZone.position.set(0, 0.5, 11.5)

    const goalZone = this.zones.getObjectByName('zone_goal')
    // console.log(goalZone)

    this.usbStandardMaterial = new THREE.MeshStandardMaterial({
      emissive: 0x157300,
      roughness: 1,
      metalness: 0,
      // wireframe: true,
      transparent: true
    })
    this.usbBasicMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      // wireframe: true,
      transparent: true
    })

    this.usb = this.files.goal.scene
    this.usb.getObjectByName(
      'model_usb_green'
    ).material = this.usbStandardMaterial

    this.usb.getObjectByName('model_usb_white').material = this.usbBasicMaterial

    // this.usbPosition = new THREE.Vector3(-0.5, 1, 11.5)
    this.usbPosition = goalZone.position
      .clone()
      .add(new THREE.Vector3(-0.5, 0, 0))
    this.usb.position.copy(this.usbPosition)
    this.usb._deltaY = 0

    this.solid.add(this.usb)

    // const GUI = useGUI()
    // GUI.addObject3D('goal', this.goalZone)
    // GUI.addObject3D('usb', this.usb)
    // GUI.addMaterial('usb-standard', this.usbStandardMaterial)
  }

  applyMaterials() {
    this.wireframe.traverse((child) => {
      if (child.name.includes('green')) {
        // child.material = GreenMaterial
        child.material = this.greenWireframeMaterial
      }

      if (child.name.includes('black')) {
        // child.material = BlackMaterial

        child.material = this.blackWireframeMaterial
      }
    })

    // zones
    this.zones = this.solid.getObjectByName('zones')
    this.zones.children.forEach((zone) => {
      zone.visible = false
    })

    // this.zones.traverse((zone) => {
    //   zone.visible = false
    // })

    this.solid.traverse((child) => {
      if (child.name.includes('model_border')) {
        child.material = this.greenMaterial
      }

      if (child.name.includes('model_wall')) {
        child.material = this.standardMaterial
      }

      if (child.name.includes('model_platform')) {
        child.material = this.standardMaterial
      }

      if (child.name.includes('zone_chekpoint')) {
        child.visible = true
        // child.position.y += -0.035

        child.position.y += 0.5

        child.scale.setScalar(0.95)

        child.material.visible = false

        child.component = new Checkpoint()

        child.add(child.component)

        // const geometry = new THREE.BoxBufferGeometry(1, 1)
        // const material = new THREE.MeshNormalMaterial()

        // const mesh = new THREE.Mesh(geometry, material)

        // child.add(mesh)
      }
    })

    // sign
    this.sign = this.solid.getObjectByName('model_sign')

    this.sign.material = this.standardMaterial

    this.signScreen = this.solid.getObjectByName('model_sign_screen')
    this.signScreen.material = new SignScreenMaterial().getMaterial()

    this.solid.getObjectByName(
      'model_terminal_black'
    ).material = this.standardMaterial
    // this.solid.getObjectByName('model_terminal_green').material = GreenMaterial

    this.solid.getObjectByName(
      'model_terminal_green'
    ).material = this.greenMaterial

    this.solid.getObjectByName(
      'model_terminal_screen'
    ).material = new TerminalScreenMaterial().getMaterial()
  }

  initBackground() {
    const { scene } = useGame()
    this.dotsPlane = new DotsPlane(LEVEL01_CONFIG.dots)
    scene.add(this.dotsPlane)

    this.dotsPlane.scale.setScalar(50)
    this.dotsPlane.rotation.x = -Math.PI / 2
  }

  initLights() {
    const { scene } = useGame()

    this.ambientLight = new THREE.AmbientLight(0x383838, 0)
    scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(
      LIGHT_CONFIG.color,
      LIGHT_CONFIG.intensity
    )
    // this.directionalLight.position.set(0, 512, 0)
    this.directionalLight.position.copy(LIGHT_CONFIG.position)
    this.directionalLight.lookAt(scene.position)
    scene.add(this.directionalLight)

    const GUI = useGUI()

    GUI.addLight('light', this.directionalLight)
  }

  initTreadmillsHitboxes() {
    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())
    box.scale.set(10, 1, 1000)

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    // this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-13, 1, 0))
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-12, 1, 0))

    this.add(this.outHitboxUpstreamMesh)
    this.outHitboxUpstreamMesh.visible = false
    this.outHitboxUpstream = new INTERSECTIONS.Hitbox(
      this.outHitboxUpstreamMesh,
      {
        layers: ['treadmill_edge'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxUpstream)

    // down stream
    this.outHitboxDownstreamMesh = box.clone()
    // this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(12, 1, 0))
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(11, 1, 0))

    this.add(this.outHitboxDownstreamMesh)
    this.outHitboxDownstreamMesh.visible = false
    this.outHitboxDownstreamMesh = new INTERSECTIONS.Hitbox(
      this.outHitboxDownstreamMesh,
      {
        layers: ['treadmill_edge'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxDownstreamMesh)
  }

  async replaceInstances() {
    const assetsManager = useAssetsManager()
    assetsManager.loader.addGroup({
      name: 'instances',
      base: '/',
      files: [
        {
          name: 'treadmill',
          path: 'obj/treadmill/treadmill_08.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/treadmill/treadmill_08_wireframe.obj'
        }
      ]
    })

    const files = await assetsManager.get('instances')
    const treadmillModel = files.treadmill.scene
    const treadmillWireframe = files.wireframe

    treadmillModel.traverse((child) => {
      child.material = this.standardMaterial
    })

    // treadmillModel.getObjectByName('soustapis_green').material = GreenMaterial
    treadmillModel.getObjectByName(
      'soustapis_green'
    ).material = this.greenMaterial

    treadmillWireframe.traverse((child) => {
      if (child.name.includes('green')) {
        // child.material = GreenMaterial

        child.material = this.greenMaterial
      }

      if (child.name.includes('black')) {
        // child.material = BlackMaterial

        child.material = this.blackMaterial
      }
    })

    // treadmillModel.getObjectByName('machine_green').material = GreenMaterial

    treadmillModel.getObjectByName(
      'machine_green'
    ).material = this.greenMaterial

    treadmillModel.getObjectByName('spawn_downstream').visible = false
    treadmillModel.getObjectByName('spawn_upstream').visible = false

    this.instances = this.solid.getObjectByName('instances')

    this.treadmills = []
    this.instances.children.forEach((child) => {
      const instanceName = child.userData.instance
      if (instanceName === 'treadmill') {
        const treadmill = new Treadmill(
          treadmillModel.clone(),
          treadmillWireframe.clone(),
          child.userData.zone
        )
        child.add(treadmill)
        this.treadmills.push(treadmill)
      }
    })
  }

  update(clock) {
    this.usb.position.y =
      this.usbPosition.y +
      (Math.sin(clock.time * 2.5) / 20 + 0.25) +
      (this.usb._deltaY || 0)

    this.usb.rotation.z = 0.4
    this.usb.rotation.y += 0.008

    this.dotsPlane.update(clock)
    const { camera } = useCamera()

    const position = new THREE.Vector3(
      camera.position.x,
      this.dotsPlane.position.y,
      camera.position.z
    )
    this.dotsPlane.position.copy(position)

    this.dotsPlane.material.uniforms.uOffset.value.x = position.x * 0.02
    this.dotsPlane.material.uniforms.uOffset.value.y = -position.z * 0.02

    if (this.paused) return
    this.treadmills.forEach((treadmill) => {
      treadmill.update(clock)
    })

    this.greenWireframeMaterial.uniforms.uTime.value = clock.time
  }

  appear() {
    const tl = new gsap.timeline()

    tl.from(
      [
        this.greenWireframeMaterial.uniforms.uAppear,
        this.blackWireframeMaterial.uniforms.uAppear
      ],
      {
        duration: 10,
        ease: 'expo.out',
        value: 0,
        stagger: 1
      },
      0
    )

    tl.from(
      this.standardMaterial,
      {
        duration: 3,
        ease: 'expo.out',
        opacity: 0
      },
      3
    )

    return tl
  }
}
