// Real photo upload helper. The browser shrinks the photo BEFORE we save it, because
// localStorage only has about 5 MB in total. A 600px JPEG is roughly 40-80 KB instead of several MB.

export const MAX_PHOTOS = 3
const MAX_SIDE = 600
const JPEG_QUALITY = 0.7
const MAX_FILE_BYTES = 15 * 1024 * 1024

// Takes a File from <input type="file"> and resolves to a small JPEG data URL (a string).
// Rejects with a short, readable message when the file is not usable.
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type).startsWith('image/')) {
      reject(new Error('Please choose an image file (JPG or PNG).'))
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('A photo is too large (maximum 15 MB).'))
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        // JPEG has no transparency: paint white first so transparent PNGs do not turn black.
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      } catch {
        reject(new Error('Could not process this photo. Try another one.'))
      } finally {
        URL.revokeObjectURL(url)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this photo. Try a JPG or PNG.'))
    }

    img.src = url
  })
}
