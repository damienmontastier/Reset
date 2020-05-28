import STANDARD_CONFIG from '@/config/standard'

export default new THREE.MeshStandardMaterial({
  metalness: STANDARD_CONFIG.metalness,
  roughness: STANDARD_CONFIG.roughness
})
