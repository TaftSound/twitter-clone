import Compressor from 'compressorjs'

const compressImage = async (image, maxWidth) => {
    const targetWidth = image.naturalWidth > maxWidth
    ? maxWidth
    : image.naturalWidth
    const aspectRatio = image.naturalWidth / image.naturalHeight
    const targetHeight = targetWidth / aspectRatio
    
    const canvas = document.createElement('canvas')
    canvas.height = targetHeight
    canvas.width = targetWidth

    const pica = require('pica')()
    const result = await pica.resize(image, canvas)
    const blob = await pica.toBlob(result, 'image/jpeg', {
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 1
    })

    return new Promise((resolve, reject) => {
      new Compressor(blob, {
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