import { Howl } from 'howler'

let audio

class AudioManager {
  constructor() {
    this.sounds = []
  }

  async add(sound) {
    console.log(this.sounds)
    this.sound = sound

    if (!this.sounds.includes(this.id)) {
      const promise = new Promise((resolve, reject) => {
        const howl = new Howl({
          src: [sound],
          id: this.id,
          onload: () => {
            resolve(howl)
          }
        })
      })

      const audio = await promise
      this.sounds[this.id] = audio
    } else {
      console.error('This sound already exist in the AudioManager')
    }
  }

  play(sound) {
    this.sound = sound

    const howl = this.sounds[this.id]

    howl.play()
  }

  stop(sound) {
    this.sound = sound

    const howl = this.sounds[this.id]

    howl.stop()
  }

  get id() {
    return this.sound.split(/\.|\//).splice(-2, 1)
  }
}

const useAudioManager = () => {
  return audio || (audio = new AudioManager())
}

export default useAudioManager
