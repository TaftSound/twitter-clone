import Compressor from 'compressorjs'

const compressImage = async (image, maxWidth) => {
    const targetWidth = maxWidth
    const aspectRatio = image.naturalWidth / image.naturalHeight
    const targetHeight = targetWidth / aspectRatio
    
    const canvas = document.createElement('canvas')
    canvas.height = targetHeight
    canvas.width = targetWidth

    let blob = false

    if (targetWidth > image.naturalWidth) {
      const pica = require('pica')()
      const result = await pica.resize(image, canvas)
      blob = await pica.toBlob(result, 'image/jpeg', {
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1
      })
    }

    return new Promise((resolve, reject) => {
      const file = blob ? blob : image
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          resolve(result)
        },
        error(err) {
          console.error("Failure to compress image:", err)
          reject(err)
        }
      })
    })
}

export default compressImage