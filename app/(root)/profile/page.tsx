"use client"

import { UserProfile } from "@/lib/types/user"
import { Button, Card } from "@heroui/react"
import { Pencil, Xmark } from "@gravity-ui/icons"
import { toast } from "@heroui/react"
import Image from "next/image"
import { useEffect, useRef, useState, ChangeEvent } from "react"
import { formatDate, formatDateLong } from "@/lib/helpers/format-date"
import { AvatarCropModal } from "@/components/modal/AvatarCropModal"

const MAX_AVATAR_BYTES = 1.5 * 1024 * 1024

const Page = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  })

  useEffect(() => {
    async function fetchProfile(){
      try {
        const res = await fetch("/api/user")

        const user = await res.json()
        if (user.success){
          setProfile(user.data)
        }
      } catch (error) {
        console.log('Failed to load profile', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const ALLOWED_AVATAR_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.danger("Format gambar harus JPG, PNG, atau Webp")
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.danger("Ukuran gambar maksimal 1.5MB")
      return
    }

    setRawImageSrc(URL.createObjectURL(file))
    setCropModalOpen(true)
  }

  const handleCropConfirm = async (croppedImage: Blob) => {
    setUploadingAvatar(true)
    const formData = new FormData()

    formData.append("avatar", croppedImage, "avatar.jpg")

    try {
      const res = await fetch("/api/user/avatar", {
        method: "PUT",
        body: formData,
      })
      const result = await res.json()
      if (result.success) {
        setProfile(
          (prev) => prev ? { ...prev, image: result.data?.image } : null
        )
        toast.success("Foto profil berhasil diperbarui")
        setCropModalOpen(false)
        setRawImageSrc(null)
      } else {
        toast.danger(result.error || "Gagal mengunggah foto")
      }
    } catch {
      toast.danger("Terjadi kesalahan, coba lagi")
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleCropCancel = () => {
    setCropModalOpen(false)
    setRawImageSrc(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEditToggle = () => {
    if (!isEditing && profile) {
      setPersonalData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalData),
      })
      const result = await res.json()

      if (result.success) {
        setProfile((prev) => prev ? { ...prev, ...personalData } : null)
        setIsEditing(false)
        toast.success("Profil berhasil diperbarui")
      } else {
        toast.danger(result.error || "Gagal memperbarui profil")
      }
    } catch {
      toast.danger("Terjadi kesalahan, coba lagi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='flex flex-wrap md:flex-nowrap gap-15 md:mt-20 w-full mb-20'>
      <Card className="relative overflow-hidden rounded-3xl w-full max-w-sm mx-auto md:mx-0" style={{ minHeight: "420px" }}>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(340deg, #4a7bd4 0%, #3452A5 40%, #1e2f6e 100%)",
          }}
        />
        <div className="absolute inset-0 z-1 opacity-10 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-10 h-full gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden shadow-xl shadow-black/20 bg-white/10">
              {profile?.image ? (
                <Image
                  alt={profile.name || "Profile photo"}
                  src={profile.image}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 text-5xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-white hover:brightness-110 transition-all duration-200 cursor-pointer border-2 border-white/20"
              aria-label="Change profile photo"
            >
              <Pencil width={16} height={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          {loading ? (
            <div className="w-36 h-8 rounded-lg bg-white/15 animate-pulse" />
          ) : (
            <h2 className="text-center text-2xl font-bold text-white tracking-wide mt-1">
              {profile?.name || "User"}
            </h2>
          )}
          {loading ? (
            <div className="w-48 h-5 rounded-md bg-white/10 animate-pulse" />
          ) : (
            <p className="text-sm text-white/70 -mt-2">
              {profile?.email || ""}
            </p>
          )}
          {!loading && profile?.isVolunteer && (
            <span className="inline-flex items-center px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white border border-white/30 bg-white/10 backdrop-blur-sm mt-1">
              Volunteer
            </span>
          )}
          {!loading && profile?.createAt && (
            <p className="text-xs text-white/50 mt-1">
              since: {formatDate(profile.createAt)}
            </p>
          )}
        </div>
      </Card>

      <Card className="rounded-3xl w-full bg-card px-8 py-8 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Personal Detail</h3>
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:brightness-110 transition-all duration-200 cursor-pointer shadow-md shadow-primary/30"
              aria-label="Edit personal details"
            >
              <Pencil width={16} height={16} />
            </button>
          ) : (
            <div className="flex gap-3">
              <Button
                onPress={handleCancel}
                className="flex-1 p-3 bg-gray-100 text-foreground hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                <Xmark />
              </Button>
              <Button
                onPress={handleSave}
                className="flex-1 bg-primary text-white hover:brightness-110 transition-all duration-200 font-semibold shadow-md shadow-primary/30"
              >
                Save
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-foreground tracking-wide">Full Name</label>
            {loading ? (
              <div className="w-48 h-5 rounded bg-gray-200 animate-pulse" />
            ) : isEditing ? (
              <input
                type="text"
                value={personalData.name}
                onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                className="text-sm text-foreground bg-transparent border-b border-primary outline-none py-1.5 transition-colors duration-200"
              />
            ) : (
              <p className="text-sm text-foreground/80 py-1.5">{profile?.name || "-"}</p>
            )}
            {!isEditing && <div className="border-b border-gray-200" />}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-foreground tracking-wide">Email</label>
            {loading ? (
              <div className="w-56 h-5 rounded bg-gray-200 animate-pulse" />
            ) : isEditing ? (
              <input
                type="email"
                disabled
                value={personalData.email}
                onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                className="text-sm text-foreground bg-transparent outline-none py-1.5 transition-colors duration-200"
              />
            ) : (
              <p className="text-sm text-foreground/80 py-1.5">{profile?.email || "-"}</p>
            )}
            <div className="border-b border-gray-200" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-foreground tracking-wide">Phone</label>
            {loading ? (
              <div className="w-44 h-5 rounded bg-gray-200 animate-pulse" />
            ) : isEditing ? (
              <input
                type="tel"
                value={personalData.phoneNumber}
                onChange={(e) => setPersonalData({ ...personalData, phoneNumber: e.target.value })}
                placeholder="+62"
                className="text-sm text-foreground bg-transparent border-b border-primary outline-none py-1.5 transition-colors duration-200"
              />
            ) : (
              <p className="text-sm text-foreground/80 py-1.5">{profile?.phoneNumber || "-"}</p>
            )}
            {!isEditing && <div className="border-b border-gray-200" />}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-foreground tracking-wide">Date of Birth</label>
            {loading ? (
              <div className="w-40 h-5 rounded bg-gray-200 animate-pulse" />
            ) : isEditing ? (
              <input
                type="date"
                value={personalData.dateOfBirth}
                onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                className="text-sm text-foreground bg-transparent border-b border-primary outline-none py-1.5 transition-colors duration-200"
              />
            ) : (
              <p className="text-sm text-foreground/80 py-1.5">{formatDateLong(profile?.dateOfBirth)}</p>
            )}
            {!isEditing && <div className="border-b border-gray-200" />}
          </div>
        </div>
      </Card>

      {cropModalOpen && rawImageSrc && (
        <AvatarCropModal
          isOpen={cropModalOpen}
          imageSrc={rawImageSrc}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
          saving={uploadingAvatar}
        />
      )}
    </div>
  )
}

export default Page
