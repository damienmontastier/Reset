import useAudio from '@/hooks/use-audio'

export default {
  bind(el, binding) {
    const params = binding.value

    const audioManager = useAudio()

    binding.listeners = {}
    Object.entries(params).forEach(([eventName, path]) => {
      audioManager.add([{ path, id: path }])
      const listener = () => {
        audioManager.play(path)
      }
      el.addEventListener(eventName, listener)
      binding.listeners[eventName] = listener
    })
  },

  unbind(el, binding) {
    Object.entries(binding.listeners).forEach(([eventName, listener]) => {
      el.removeEventListener(eventName, listener)
    })
  }
}
