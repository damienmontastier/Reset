export default {
  dots: {
    dotsRadius: 0.2,
    dotsFrenquency: 942,
    noiseAmplitude: 0.002,
    noiseFrequency: 10,
    color: 0x2ff000
  },
  cameras: {
    default: {
      normalized_angle: new THREE.Vector3(0.13, 0.7, 0.7),
      distance: 7
    },
    appear: {
      normalized_angle: new THREE.Vector3(0.1, 0.55, 0.7),
      distance: 4
    },
    close_up: {
      normalized_angle: new THREE.Vector3(0.2, 0.3, 0.7),
      distance: 4
    },
    goal: {
      normalized_angle: new THREE.Vector3(0.13, 0.7, 0.7),
      distance: 5
    }
  }
}
