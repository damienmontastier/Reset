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
      normalized_angle: new THREE.Vector3(1.1, 6, 6).normalize(),
      distance: 7
    },
    close_up: {
      normalized_angle: new THREE.Vector3(-1.1, 6, 6).normalize(),
      distance: 3.5
    }
  }
}
