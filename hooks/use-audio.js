import { Howl } from 'howler'

let audio

class AudioManager {
  constructor() {
    this.sounds = {}
  }

  add(sounds, cb) {
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
            }
          })
        })

        promises.push(promise)
      } else {
        console.error('A sound with the same ID has already been added.')
      }
    })

    Promise.all(promises).then(() => {
      cb()
    })
  }

  play(sound) {
    this.sounds[sound].play()
  }

  pause(sound) {
    this.sounds[sound].pause()
  }

  stop(sound) {
    this.sounds[sound].stop()
  }

  pathToId(path) {
    return path.split(/\.|\//).splice(-2, 1)[0]
  }
}

const useAudioManager = () => {
  return audio || (audio = new AudioManager())
}

export default useAudioManager
