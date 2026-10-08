"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Modal, Button } from "@heroui/react"
import { getCroppedImage, type CropArea } from "@/lib/helpers/crop-image"

interface AvatarCropModalProps {
  isOpen: boolean
  imageSrc: string
  onCancel: () => void
  onConfirm: (croppedImage: Blob) => Promise<void>
  saving?: boolean
}

export function AvatarCropModal({
  isOpen,
  imageSrc,
  onCancel,
  onConfirm,
  saving = false,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)

  const onCropComplete = useCallback((_croppedArea: CropArea, croppedAreaPx: CropArea) => {
    setCroppedAreaPixels(croppedAreaPx)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels || saving) return

    try {
      const cropped = await getCroppedImage(imageSrc, croppedAreaPixels)
      await onConfirm(cropped)
    } catch (error) {
      console.error("Failed to crop avatar: ", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Modal.Backdrop isDismissable={!saving}>
        <Modal.Container>
          <Modal.Dialog>
            {!saving && <Modal.CloseTrigger/>}
            <Modal.Header>
              <Modal.Heading>Atur Foto Profil</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-black/5">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="flex items-center gap-3 mt-5">
                <span className="text-xs font-bold text-foreground/60">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                onPress={onCancel}
                isDisabled={saving}
                className="flex-1 bg-gray-100 text-foreground hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                Batal
              </Button>
              <Button
                onPress={handleConfirm}
                isDisabled={saving || !croppedAreaPixels}
                isPending={saving}
                className="flex-1 bg-primary text-white hover:brightness-110 transition-all duration-200 font-semibold"
              >
                Gunakan Foto
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}