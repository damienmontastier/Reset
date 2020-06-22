export default function(imgs) {
  const promises = []

  const images = [...imgs]
  images.forEach((images) => {
    const promise = new Promise((resolve, reject) => {
      images.addEventListener('load', () => {
        resolve()
      })
    })
    promises.push(promise)
  })

  return new Promise((resolve, reject) => {
    Promise.all(promises).then(() => {
      resolve()
    })
  })
}
