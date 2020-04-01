let assetsManager

const useAssetsManager = () => {
  if (!assetsManager) {
    const AssetsManager = require('@/services/assets/manager').default
    assetsManager = new AssetsManager()
  }
  return assetsManager
}

export default useAssetsManager
