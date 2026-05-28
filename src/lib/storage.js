import { createClient } from '@/utils/supabase/client'

/**
 * Compress an image and upload to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadAnalysisImage(base64Data, userId, type) {
  const supabase = createClient()

  // Decode base64 and create a compressed JPEG via canvas (client-side)
  const img = await loadImage(base64Data)
  const compressed = compressImage(img, 800, 0.7)

  // Convert blob to File
  const filename = `${type}-${Date.now()}.jpg`
  const file = new File([compressed], filename, { type: 'image/jpeg' })

  const path = `${userId}/${filename}`
  const { data, error } = await supabase.storage
    .from('meal-analyses')
    .upload(path, file, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (error) {
    console.error('Storage upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('meal-analyses')
    .getPublicUrl(path)

  return urlData.publicUrl
}

/**
 * Server-side: upload base64 image to Supabase Storage using service key.
 * Returns the public URL.
 */
export async function uploadAnalysisImageServer(base64Data, userId, type, supabase) {
  const buffer = Buffer.from(base64Data, 'base64')
  const filename = `${type}-${Date.now()}.jpg`
  const path = `${userId}/${filename}`

  const { data, error } = await supabase.storage
    .from('meal-analyses')
    .upload(path, buffer, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (error) {
    console.error('Storage upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('meal-analyses')
    .getPublicUrl(path)

  return urlData.publicUrl
}

function loadImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`
  })
}

function compressImage(img, maxWidth, quality) {
  const canvas = document.createElement('canvas')
  const ratio = Math.min(1, maxWidth / img.width)
  canvas.width = img.width * ratio
  canvas.height = img.height * ratio
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return dataURLtoBlob(canvas.toDataURL('image/jpeg', quality))
}

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',')
  const byteString = atob(parts[1])
  const mimeString = parts[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}
