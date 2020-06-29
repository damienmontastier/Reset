export default {
  dots: {
    dotsRadius: 0.08,
    dotsFrenquency: 71,
    noiseAmplitude: 0.0025,
    noiseFrequency: 10,
    color: 0x000000
  },
  lights: {
    position: new THREE.Vector3(0, 512, 0),
    intensity: 0.3,
    color: 0xffffff
  },
  cameras: {
    start: {
      normalized_angle: new THREE.Vector3(0.6, 0.6, 0.7),
      distance: 7
    },
    default: {
      normalized_angle: new THREE.Vector3(0.13, 0.7, 0.7),
      distance: 7
    },
    afterStart: {
      normalized_angle: new THREE.Vector3(0.13, 0.7, -0.6),
      distance: 7
    },
    test: {
      normalized_angle: new THREE.Vector3(0.8, 0.7, -1.5),
      distance: 7
    }
  }
}
