export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (err) => reject(err))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

export async function getCroppedImage(
  imageSrc: string,
  cropArea: CropArea,
  outputSize = 512
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = outputSize
  canvas.height = outputSize

  const x = Math.round(cropArea.x)
  const y = Math.round(cropArea.y)
  const width = Math.round(cropArea.width)
  const height = Math.round(cropArea.height)

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get canvas context")

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    outputSize,
    outputSize
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        resolve(blob)
      },
      "image/jpeg",
      0.9
    )
  })
}