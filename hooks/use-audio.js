import { Howl, Howler } from 'howler'

import useGUI from '@/hooks/use-gui'

// Gerer le son global de howler

let audio

class AudioManager {
  constructor() {
    const params = {
      volume: 0.1
    }

    Howler.volume(params.volume)

    const GUI = useGUI()
    GUI.audio
      .add(params, 'volume')
      .name('global volume')
      .step(0.05)
      .min(0)
      .max(1)
      .onChange(() => {
        Howler.volume(params.volume)
      })

    this.sounds = {}
  }

  add(sounds) {
    const GUI = useGUI()
    const promises = []

    sounds.forEach((sound) => {
      if (!this.sounds.hasOwnProperty(sound.id)) {
        this.sounds[sound.id] = sound.id

        const promise = new Promise((resolve, reject) => {
          const howl = new Howl({
            src: [sound.path],
            onload: () => {
              howl._id = sound.id
              this.sounds[sound.id] = howl

              resolve()

              const params = {
                volume: 1
              }

              GUI.audio
                .add(params, 'volume')
                .name(sound.id)
                .step(0.05)
                .min(0)
                .max(1)
                .onChange(() => {
                  howl.volume(params.volume)
                })
            }
          })
        })

        promises.push(promise)
      } else {
        console.error('A sound with the same ID has already been added.')
      }
    })

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(resolve)
    })

    // Promise.all(promises).then(() => {
    //   cb()
    // })
  }

  play(id) {
    const sound = this.sounds[id]
    sound.play()
    return sound
  }

  pause(sound) {
    this.sounds[sound].pause()
  }

  stop(sound) {
    this.sounds[sound].stop()
  }

  // pathToId(path) {
  //   return path.split(/\.|\//).splice(-2, 1)[0]
  // }
}

const useAudioManager = () => {
  return audio || (audio = new AudioManager())
}

export default useAudioManager
