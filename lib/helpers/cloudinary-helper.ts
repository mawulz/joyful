import cloudinary from "../cloudinary"

export function uploadPdfToCloudinary(
  buffer: Buffer,
  publicId: string
) {
  return new Promise<{
    secure_url: string
    public_id: string
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "volunteer-cv",
        public_id: publicId,
        resource_type: "image",
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(
            new Error("Cloudinary upload returned no result")
          )
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        })
      }
    )

    stream.end(buffer)
  })
}