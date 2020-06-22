import useAudio from '@/hooks/use-audio'

export default {
  bind(el, binding) {
    const params = binding.value

    const audioManager = useAudio()

    el.vSoundsListeners = {}
    Object.entries(params).forEach(([eventName, path]) => {
      audioManager.add([{ path, id: path }])
      const listener = () => {
        audioManager.play(path)
      }
      el.addEventListener(eventName, listener)
      el.vSoundsListeners[eventName] = listener
    })
  },

  unbind(el, binding) {
    setTimeout(() => {
      Object.entries(el.vSoundsListeners).forEach(([eventName, listener]) => {
        el.removeEventListener(eventName, listener)
      })
    }, 0)
  }
}
